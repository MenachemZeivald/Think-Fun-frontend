import React, { useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/axios';

import GameCard from '../GameCard';
import GamePlay from './GamePlay';
import InviteFriend from '../TicTacToe/inviteFriend';
import Result from '../TicTacToe/Result';

export default function Checkers() {
	const { idRoom } = useParams();

	const [gameStatus, setGameStatus] = useState({
		gameType: null,
		level: null,
		needToInviteFriend: null,
		winner: null,
	});

	const [gameObj, setGameObj] = useState();
	const [socket, setSocket] = useState();

	const { gameType, level, needToInviteFriend, winner } = gameStatus;

	if (idRoom && !socket) setSocket(io.connect(BASE_URL));

	if (idRoom && socket && !gameObj)
		connectToRoom(socket, idRoom, gameStatus, setGameObj, setGameStatus);

	function resetLevel() {
		setGameStatus({
			...gameStatus,
			level: null,
			winner: null,
		});
	}

	return !gameType ? (
		<>
			<GameCard
				setter={gameType => setGameStatus({ ...gameStatus, gameType })}
				name='VS Person'
			/>
			<GameCard
				setter={gameType => setGameStatus({ ...gameStatus, gameType })}
				name='VS AI'
			/>
		</>
	) : gameType === 'VS Person' && needToInviteFriend === null ? (
		<>
			<GameCard
				setter={() => setGameStatus({ ...gameStatus, needToInviteFriend: false })}
				name='random player'
			/>
			<GameCard
				setter={() => setGameStatus({ ...gameStatus, needToInviteFriend: true })}
				name='invite friend'
			/>
		</>
	) : needToInviteFriend ? (
		<InviteFriend
			game={'Checkers'}
			setGameObj={setGameObj}
			setIsRandomPlayer={() => setGameStatus({ ...gameStatus, needToInviteFriend: false })}
			setSocket={setSocket}
			socket={socket}
		/>
	) : gameType === 'VS AI' && !level ? (
		<>
			<GameCard setter={level => setGameStatus({ ...gameStatus, level })} name='Easy' />
			<GameCard setter={level => setGameStatus({ ...gameStatus, level })} name='Medium' />
			<GameCard setter={level => setGameStatus({ ...gameStatus, level })} name='Hard' />
		</>
	) : !winner ? (
		<GamePlay
			level={level || 'person'}
			resetLevel={resetLevel}
			winner={winner}
			setWinner={res => setGameStatus({ ...gameStatus, winner: res })}
		/>
	) : (
		<Result
			res={winner}
			resetLevel={gameType === 'VS AI' && resetLevel}
			resetBoard={() => setGameStatus({ ...gameStatus, winner: null })}
			typeGame={'checkers'}
			isOnline={gameType !== 'VS AI'}
			level={level}
		/>
	);
}
function connectToRoom(socket, idRoom, gameStatus, setGameObj, setGameStatus) {
	socket.on('connect', () => console.log(socket.id));
	socket.emit('invitation-link', idRoom);
	socket.on('game-started', room => {
		setGameObj(room);
		setGameStatus({
			...gameStatus,
			gameType: 'VS Person',
			needToInviteFriend: false,
		});
		socket.emit('join-room', room.id_room);
	});
}
