import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Board from './Board';

import { AIturn, checkIfWin, findWinArr } from './functions';

const socket = io.connect('http://localhost:3002');

export default function GamePlay({ level, winner, setWinner }) {
	const CONNECTED = 1;
	const DISCONNECTED = -1;
	const WAITING_FOR_CONNECT = 0;

	const [board, setBoard] = useState([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	const [turn, setTurn] = useState('X');
	const [userSign, setUserSign] = useState();
	const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
	const [room, setRoom] = useState();

	let gameObj = { room, userSign }; // what about the user sign?

	// useEffect(() => {
	// 	socket.on('connect', () => console.log(socket.id));
	// 	//add name and image
	// 	socket.emit('start-game');
	// 	socket.on('game-started', room => {
	// 		setConnection(true);
	// 		setGameObg(room);
	// 		socket.emit('join-room', room.id_room);
	// 		isMyTurn = room.whose_turn === socket.id ? true : false;
	// 		console.log(room);
	// 	});
	// }, []);
	// const sendMessage = () => {
	// 	console.log(gameObg);
	// 	socket.emit('active-game', gameObg);
	// 	isMyTurn = false;
	// 	console.log(isMyTurn);
	// };

	// useEffect(() => {
	// 	socket.on('active-game', gameObgReceive => {
	// 		console.log('receive ', gameObgReceive);
	// 		setMessageReceived(gameObgReceive.board);
	// 		isMyTurn = gameObgReceive.whose_turn === socket.id ? true : false;
	// 		console.log(isMyTurn);
	// 	});
	// 	socket.on('user-left', message => {
	// 		setDisconnected(true);
	// 		console.log(message);
	// 	});
	// }, [socket]);

	useEffect(() => {
		if (level === 'person') {
			socket.on('connect', () => console.log(socket.id));
			//add name and image
			socket.emit('start-game');
			socket.on('game-started', room => {
				setConnection(CONNECTED);
				setRoom(room);
				socket.emit('join-room', room.id_room);
				console.log(room);
			});
		}
	}, []);

	useEffect(() => {
		if (level === 'person') {
			socket.on('active-game', gameObgReceive => {
				console.log('receive ', gameObgReceive);
				makeTurn(gameObgReceive.index);
			});
			socket.on('user-left', message => {
				setConnection(DISCONNECTED);
				console.log(message);
			});
		}
	}, [socket]);

	useEffect(() => {
		if (!res && turn === 'O') {
			setTimeout(() => {
				makeTurn(AIturn(board, level), 'O');
			}, 150);
		}
		// eslint-disable-next-line
	}, [turn]);

	function makeTurn(index, sign) {
		setBoard(prevBoard => {
			let tempBoard = [...prevBoard];
			tempBoard[index] = sign || 'X';
			return tempBoard;
		});
		setTurn(sign === 'O' ? 'X' : 'O');
		if (level === 'person') {
			socket.emit('active-game', { ...gameObj, index });
		}
	}

	function resetBoard() {
		setBoard([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	}

	/* Checking if there is a winner. */
	let winArr = [];
	let res = checkIfWin(board, turn === 'O' ? 'X' : 'O');
	if (!winner && res) {
		winArr = res === 'tie' ? [...board.keys()] : findWinArr(board, turn === 'O' ? 'X' : 'O');
		setTimeout(() => {
			setWinner(res === 'tie' ? res : board[winArr[0]] === userSign ? 'win' : 'lose');
		}, 1500);
	}

	if (level === 'person' && connection === WAITING_FOR_CONNECT) {
		return <h1>LOADING</h1>;
	}
	if (connection === DISCONNECTED) {
		return <h1>ERROR</h1>;
	}

	return (
		<Board
			board={board}
			makeTurn={makeTurn}
			myTurn={turn === userSign}
			winArr={winArr}
			resetFunc={resetBoard}
			vsPerson={level === 'person'}
		/>
	);
}
