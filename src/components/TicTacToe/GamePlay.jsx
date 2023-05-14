import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from '../../api/axios';
import { BASE_URL } from '../../api/axios';

import Board from './Board';

import { AIturn, checkIfWin, findWinArr, isMyTurn } from './functions';
import LoadingGif from '../games/LoadingGif';

export default function GamePlay({ socketDetails, level, winner, setWinner, setGameObj, gameObj }) {
	const CONNECTED = 1;
	const DISCONNECTED = -1;
	const WAITING_FOR_CONNECT = 0;

	const [socket] = useState(socketDetails || io.connect(BASE_URL));
	const [board, setBoard] = useState([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	const [userSign, setUserSign] = useState(level === 'person' ? null : 'X');
	const [canAskHelp, setCanAskHelp] = useState(true);
	const [connection, setConnection] = useState(WAITING_FOR_CONNECT);

	let myTurn = isMyTurn(board, userSign);

	// console.log('gameObj: ', gameObj);

	useEffect(() => {
		if (level === 'person' && !gameObj) {
			socket.on('connect', () => console.log(socket.id));
			socket.emit('start-tic-tac-toe');
			socket.on('game-started', room => {
				setConnection(CONNECTED);
				setGameObj(room);
				// console.log(room);
				setUserSign(socket.id === room.idPlayer1 ? 'X' : 'O');
				socket.emit('join-room', room.id_room);
			});
		}
		if (level === 'person' && gameObj) {
			setConnection(CONNECTED);
			setUserSign(socket.id === gameObj.idPlayer1 ? 'X' : 'O');
		}
		return () => {
			if (level === 'person') {
				socket.emit('disconnected');
				setGameObj();
				// console.log('disconnected', gameObj);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (level === 'person') {
			socket.on('active-game', gameObgReceive => {
				let index = gameObgReceive.index;
				let sign = socket.id === gameObgReceive.idPlayer1 ? 'O' : 'X';
				setBoard(prevBoard => {
					let tempBoard = [...prevBoard];
					tempBoard[index] = sign;
					return tempBoard;
				});
			});
			socket.on('user-left', () => {
				setConnection(DISCONNECTED);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	useEffect(() => {
		if (!res && !myTurn && level !== 'person') {
			setTimeout(() => {
				makeTurn(AIturn(board, level), 'O');
			}, 150);
		}
		// eslint-disable-next-line
	}, [myTurn]);

	const helpFromGPT = async () => {
		try {
			const response = await axios.post(`games/helpFromGPT/?typeGame=${'tic_tac_toe'}`, {
				board,
				sign: userSign,
			});
			setCanAskHelp(false);
			makeTurn(response.data, userSign);
		} catch (error) {
			console.log(error.response.data);
		}
	};

	function makeTurn(index, sign) {
		if (level === 'person') {
			sign = userSign;
		}
		setBoard(prevBoard => {
			let tempBoard = [...prevBoard];
			tempBoard[index] = sign || 'X';
			return tempBoard;
		});
		if (level === 'person') {
			socket.emit('active-game', { ...gameObj, index });
		}
	}

	function resetBoard() {
		setBoard([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	}

	/* Checking if there is a winner. */
	let winArr = [];
	let res = checkIfWin(board);
	if (!winner && res) {
		winArr = res === 'tie' ? [...board.keys()] : findWinArr(board, res);
		setTimeout(() => {
			setWinner(res === 'tie' ? res : res === userSign ? 'win' : 'lose');
		}, 1500);
	}

	if (level === 'person' && connection === WAITING_FOR_CONNECT) {
		return <LoadingGif />;
	}

	if (connection === DISCONNECTED) {
		return <h1>user left</h1>;
	}

	return (
		<Board
			board={board}
			socketID={gameObj && [socket, gameObj.id_room]}
			setBoard={setBoard}
			userSign={userSign}
			makeTurn={makeTurn}
			myTurn={myTurn}
			winArr={winArr}
			resetFunc={resetBoard}
			vsPerson={level === 'person'}
			helpFromGPT={canAskHelp && helpFromGPT}
		/>
	);
}
