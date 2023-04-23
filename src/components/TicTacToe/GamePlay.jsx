import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../../api/axios';

import Board from './Board';

import { AIturn, checkIfWin, findWinArr, isMyTurn } from './functions';

export default function GamePlay({ level, winner, setWinner }) {
    const CONNECTED = 1;
    const DISCONNECTED = -1;
    const WAITING_FOR_CONNECT = 0;

    const [socket] = useState(io(BASE_URL));
    const [board, setBoard] = useState([' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']);
    const [userSign, setUserSign] = useState(level === 'person' ? null : 'X');
    const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
    const [gameObj, setGameObj] = useState();

    let myTurn = isMyTurn(board, userSign);

    useEffect(() => {
        if (level === 'person') {
            socket.on('connect', () => console.log(socket.id));
            socket.emit('start-tic-tac-toe');
            socket.on('game-started', (room) => {
                setConnection(CONNECTED);
                setGameObj(room);
                setUserSign(socket.id === room.idPlayer1 ? 'X' : 'O');
                socket.emit('join-room', room.id_room);
            });
            return () => {
                socket.emit('disconnected');
            };
        }
    }, []);

    useEffect(() => {
        if (level === 'person') {
            socket.on('active-game', (gameObgReceive) => {
                let index = gameObgReceive.index;
                let sign = socket.id === gameObgReceive.idPlayer1 ? 'O' : 'X';
                setBoard((prevBoard) => {
                    let tempBoard = [...prevBoard];
                    tempBoard[index] = sign;
                    return tempBoard;
                });
            });
            socket.on('user-left', () => {
                setConnection(DISCONNECTED);
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
            sign = userSign;
        }
        setBoard((prevBoard) => {
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
        return <img src='https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700' />;
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
        />
    );
}
