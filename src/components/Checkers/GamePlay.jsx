import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../../api/axios';

import CheckerBoard from './Board';
import LoadingGif from '../games/LoadingGif';

import { getLegalMoves, movePiece, checkIfWin, AiTurn, countPieces } from './functions';

export default function GamePlay({ level, winner, setWinner }) {
	const CONNECTED = 1;
	const DISCONNECTED = -1;
	const WAITING_FOR_CONNECT = 0;

	const [socket] = useState(io(BASE_URL));
	const [board, setBoard] = useState([]);
	const [legalMoves, setLegalMoves] = useState([]);
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
			socket.emit('start-checkers');
			socket.on('game-started', room => {
				setConnection(CONNECTED);
				setGameObj(room);
				setUserColor(socket.id === room.idPlayer1 ? 'red' : 'black');
				socket.emit('join-room', room.id_room);
				return () => {
					socket.on('disconnect');
				};
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const movePieceMemoized = useCallback((board, currIndex, color, isKing, nextIndex) => {
		return movePiece(board, currIndex, color, isKing, nextIndex);
	}, []);

	useEffect(() => {
		if (level === 'person') {
			socket.on('active-game', gameObgReceive => {
				setBoard(board => {
					let [rowIndex, columnIndex] = gameObgReceive.prevIndex;
					let [rowIndex2, columnIndex2] = gameObgReceive.nextIndex;
					let color = socket.id === gameObgReceive.idPlayer1 ? 'black' : 'red';
					let isKing = board[rowIndex][columnIndex].isKing;
					return movePieceMemoized(board, [rowIndex, columnIndex], color, isKing, [
						rowIndex2,
						columnIndex2,
					]);
				});
				setTurn(turn => (turn === 'red' ? 'black' : 'red'));
			});
		}
	}, [level, socket, movePieceMemoized]);

	useEffect(() => {
		if (level !== 'person' && turn === 'black') {
			setTimeout(() => {
				let [piecePosition, nextPosition] = AiTurn(board, level);
				if (piecePosition === null) {
					let { redPieces, blackPieces } = countPieces(board);
					let res =
						redPieces === blackPieces
							? 'tie'
							: redPieces > blackPieces
							? 'win'
							: 'lose';
					setWinner(res);
					return;
				}
				let [pieceRow, pieceColumn] = piecePosition;
				let isKing = board[pieceRow][pieceColumn]?.isKing;
				let tempBoard = movePiece(board, piecePosition, 'black', isKing, nextPosition);
				setBoard(tempBoard);
				setTurn('red');
			}, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	function getMoves(rowIndex, columnIndex, piece) {
		if (piece === null) return;
		setChosenPiece([rowIndex, columnIndex]);
		let legalMoves = getLegalMoves(board, [rowIndex, columnIndex], piece.piece, piece.isKing);
		setLegalMoves(legalMoves);
	}

	function makeMove(rowIndex, columnIndex) {
		let chosenPieceRow = chosenPiece[0];
		let chosenPieceColumn = chosenPiece[1];
		let color = board[chosenPieceRow][chosenPieceColumn].piece;
		let isKing = board[chosenPieceRow][chosenPieceColumn].isKing;
		let tempBoard = movePiece(board, [chosenPieceRow, chosenPieceColumn], color, isKing, [
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

	let res = checkIfWin(board, userColor, turn);
	if (!winner && res) {
		setTimeout(() => {
			setWinner(res);
			// resetLevel();
		}, 1000);
	}

	if (level === 'person' && connection === WAITING_FOR_CONNECT) {
		return <LoadingGif />;
	}
	if (connection === DISCONNECTED) {
		return <h1>user left</h1>;
	}

	return (
		<CheckerBoard
			board={board}
			getMoves={getMoves}
			makeMove={makeMove}
			socketID={gameObj && [socket, gameObj.id_room]}
			vsPerson={level === 'person'}
			myTurn={userColor === turn}
			userColor={userColor}
			legalMoves={legalMoves}
			chosenPiece={chosenPiece}
			resetFunc={resetBoard}
		/>
	);
}
