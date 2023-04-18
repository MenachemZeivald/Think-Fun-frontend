import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../../api/axios';

import CheckerBoard from './Board';

import { getLegalMoves, movePiece, checkIfWin, AiRandomMove } from './functions';

const socket = io.connect(BASE_URL);

export default function GamePlay({ level, winner, setWinner }) {
	const CONNECTED = 1;
	const DISCONNECTED = -1;
	const WAITING_FOR_CONNECT = 0;

	const [board, setBoard] = useState([]);
	const [legalMoves, setLegalMoves] = useState([]);
	// const [doubleJumpMoves, setDoubleJumpMoves] = useState([]);
	const [chosenPiece, setChosenPiece] = useState(null);
	const [userColor, setUserColor] = useState(level === 'person' ? null : 'red');
	const [turn, setTurn] = useState('red');
	const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
	const [gameObj, setGameObj] = useState();

	useEffect(() => {
		setBoard(initBoard());
	}, []);

	useEffect(() => {
		if (level === 'person') {
			socket.on('connect', () => console.log(socket.id));
			//add name and image
			socket.emit('start-tic-tac-toe');
			socket.on('game-started', room => {
				setConnection(CONNECTED);
				setGameObj(room);
				setUserColor(socket.id === room.idPlayer1 ? 'red' : 'black');
				socket.emit('join-room', room.id_room);
			});
			socket.on('disconnect', () => {
				setConnection(DISCONNECTED);
			});
			return () => {
				socket.off('connect');
				socket.off('game-started');
				socket.off('disconnect');
			};
		}
	}, []);

	const movePieceMemoized = useCallback(
		(board, rowIndex, columnIndex, color, isKing, nextIndex) => {
			return movePiece(board, rowIndex, columnIndex, color, isKing, nextIndex);
		},
		[]
	);

	useEffect(() => {
		if (level === 'person') {
			socket.on('active-game', gameObgReceive => {
				setBoard(board => {
					let [rowIndex, columnIndex] = gameObgReceive.prevIndex;
					let [rowIndex2, columnIndex2] = gameObgReceive.nextIndex;
					let color = socket.id === gameObgReceive.idPlayer1 ? 'black' : 'red';
					let isKing = board[rowIndex][columnIndex].isKing;
					return movePieceMemoized(board, rowIndex, columnIndex, color, isKing, [
						rowIndex2,
						columnIndex2,
					]);
				});
				setTurn(turn => (turn === 'red' ? 'black' : 'red'));
			});
			return () => {
				socket.off('active-game');
			};
		}
	}, [level, socket, movePieceMemoized]);

	useEffect(() => {
		if (level !== 'person' && turn === 'black') {
			setTimeout(() => {
				let [piecePosition, nextPosition] = AiRandomMove(board);
				console.log(piecePosition, nextPosition);
				let [pieceRow, pieceColumn] = piecePosition;
				let isKing = board[pieceRow][pieceColumn].isKing;
				let tempBoard = movePiece(
					board,
					pieceRow,
					pieceColumn,
					'black',
					isKing,
					nextPosition
				);
				setBoard(tempBoard);
				setTurn('red');
			}, 1000);
		}
	}, [turn]);

	function initBoard() {
		let board = [];
		for (let i = 0; i < 8; i++) {
			board.push([]);
			for (let j = 0; j < 8; j++) {
				board[i].push({
					color: i % 2 === j % 2 ? 'black' : 'white',
					piece: null,
				});
				if (i < 3 && board[i][j].color === 'black') {
					board[i][j].piece = 'red';
				}
				if (i > 4 && board[i][j].color === 'black') {
					board[i][j].piece = 'black';
				}
			}
		}
		return board;
	}

	function squareClickHandler(rowIndex, columnIndex, piece) {
		if (piece === null) return;
		setChosenPiece([rowIndex, columnIndex]);
		let [legalMoves, doubleJumpMoves] = getLegalMoves(
			board,
			[rowIndex, columnIndex],
			piece.piece,
			piece.isKing
		);
		// setDoubleJumpMoves(doubleJumpMoves);
		setLegalMoves(legalMoves);
	}

	function moveClickHandler(rowIndex, columnIndex) {
		let chosenPieceRow = chosenPiece[0];
		let chosenPieceColumn = chosenPiece[1];
		let color = board[chosenPieceRow][chosenPieceColumn].piece;
		let isKing = board[chosenPieceRow][chosenPieceColumn].isKing;
		let tempBoard = movePiece(board, chosenPieceRow, chosenPieceColumn, color, isKing, [
			rowIndex,
			columnIndex,
		]);
		setBoard(tempBoard);
		setChosenPiece(null);
		setLegalMoves([]);
		setTurn(turn === 'red' ? 'black' : 'red');
		if (level === 'person') {
			let gameObjSend = {
				...gameObj,
				prevIndex: chosenPiece,
				nextIndex: [rowIndex, columnIndex],
			};
			socket.emit('active-game', gameObjSend);
		}
	}

	function resetBoard() {
		if (winner) return;
		setBoard(initBoard());
		setLegalMoves([]);
		setChosenPiece(null);
		setTurn('red');
	}

	let res = checkIfWin(board, userColor);
	if (!winner && res) {
		setTimeout(() => {
			setWinner(res);
			// resetLevel();
		}, 1000);
	}

	if (level === 'person' && connection === WAITING_FOR_CONNECT) {
		return <h1>LOADING</h1>;
	}
	if (connection === DISCONNECTED) {
		return <h1>user left</h1>;
	}

	return (
		<CheckerBoard
			board={board}
			squareClickHandler={squareClickHandler}
			makeMove={moveClickHandler}
			myTurn={userColor === turn}
			userColor={userColor}
			legalMoves={legalMoves}
			chosenPiece={chosenPiece}
			resetFunc={resetBoard}
		/>
	);
}
