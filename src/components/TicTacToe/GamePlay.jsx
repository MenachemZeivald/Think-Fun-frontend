import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Board from './Board';

import { AIturn, checkIfWin, findWinArr, isMyTurn } from './functions';

const socket = io.connect('http://localhost:3002');

export default function GamePlay({ level, winner, setWinner }) {
	const CONNECTED = 1;
	const DISCONNECTED = -1;
	const WAITING_FOR_CONNECT = 0;

	const [board, setBoard] = useState([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	const [userSign, setUserSign] = useState(level === 'person' ? null : 'X');
	const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
	const [gameObj, setGameObj] = useState();

	let myTurn = isMyTurn(board, userSign);

	useEffect(() => {
		if (level === 'person') {
			socket.on('connect', () => console.log(socket.id));
			//add name and image
			socket.emit('start-game');
			socket.on('game-started', room => {
				setConnection(CONNECTED);
				setGameObj(room);
				setUserSign(socket.id === room.player1.id ? 'X' : 'O');
				socket.emit('join-room', room.id_room);
				console.log(room);
			});
		}
	}, []);

	useEffect(() => {
		if (level === 'person') {
			socket.on('active-game', gameObgReceive => {
				console.log('receive ', gameObgReceive);
				let index = gameObgReceive.index;
				let sign = socket.id === gameObgReceive.player1.id ? 'O' : 'X';
				setBoard(prevBoard => {
					let tempBoard = [...prevBoard];
					tempBoard[index] = sign || 'X';
					return tempBoard;
				});
			});
			socket.on('user-left', message => {
				setConnection(DISCONNECTED);
				console.log(message);
			});
		}
	}, [socket]);

	useEffect(() => {
		if (!res && !myTurn) {
			setTimeout(() => {
				makeTurn(AIturn(board, level), 'O');
			}, 150);
		}
		// eslint-disable-next-line
	}, [myTurn]);

	function makeTurn(index, sign) {
		if (level === 'person') {
			sign = socket.id === gameObj.player1.id ? 'X' : 'O';
		}
		setBoard(prevBoard => {
			let tempBoard = [...prevBoard];
			tempBoard[index] = sign || 'X';
			return tempBoard;
		});
		if (level === 'person') {
			socket.emit('active-game', { ...gameObj, index });
			console.log(gameObj);
		}
	}

	function resetBoard() {
		setBoard([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	}

	/* Checking if there is a winner. */
	let winArr = [];
	let res = checkIfWin(board);
	console.log('res', res);
	if (!winner && res) {
		winArr = res === 'tie' ? [...board.keys()] : findWinArr(board, res);
		setTimeout(() => {
			setWinner(res === 'tie' ? res : res === userSign ? 'win' : 'lose');
		}, 1500);
	}

	if (level === 'person' && connection === WAITING_FOR_CONNECT) {
		return <h1>LOADING</h1>;
	}
	if (connection === DISCONNECTED) {
		return <h1>user left</h1>;
	}

	return (
		<Board
			board={board}
			makeTurn={makeTurn}
			myTurn={myTurn}
			winArr={winArr}
			resetFunc={resetBoard}
			vsPerson={level === 'person'}
		/>
	);
}
