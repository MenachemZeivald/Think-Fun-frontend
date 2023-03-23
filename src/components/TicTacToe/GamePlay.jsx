import React, { useState, useEffect } from 'react';

import Board from './Board';

import { AIturn, checkIfWin, findWinArr } from './functions';

export default function GamePlay({ level, winner, setWinner }) {
	const [board, setBoard] = useState([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	const [turn, setTurn] = useState('X');
	const userSign = 'X';

	// let obj = {id_room: 'fedah#z^%2u7q', index: 4, sign: 'X'}

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
	}

	function resetBoard() {
		setBoard([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
	}

	if (level === 'person') {
		alert('still not working');
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

	return (
		<Board
			board={board}
			makeTurn={makeTurn}
			myTurn={turn === userSign}
			winArr={winArr}
			resetFunc={resetBoard}
		/>
	);
}
