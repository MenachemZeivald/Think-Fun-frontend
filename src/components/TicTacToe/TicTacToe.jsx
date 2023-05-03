import React, { useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/axios';

import GameCard from '../GameCard';
import Level from './Level';
import GamePlay from './GamePlay';
import Result from './Result';
import InviteFriend from './inviteFriend';

import img1vs1 from '../../assets/personPlay.png';
import imgvsai from '../../assets/robot_play.png';

export default function TicTacToe() {
	const { idRoom } = useParams();

	const [gameStatus, setGameStatus] = useState({
		name: null,
		level: null,
		needToInviteFriend: null,
		winner: null,
	});
	const [gameObj, setGameObj] = useState();
	const [socket, setSocket] = useState();

	const { name, level, needToInviteFriend, winner } = gameStatus;

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

	if (!name) {
		return (
			<>
				<GameCard
					bgImg={img1vs1}
					setter={name => setGameStatus({ ...gameStatus, name })}
					name='VS Person'
				/>
				<GameCard
					bgImg={imgvsai}
					setter={name => setGameStatus({ ...gameStatus, name })}
					name='VS AI'
				/>
			</>
		);
	} else if (name === 'VS AI' && !level) {
		return <Level setLevel={level => setGameStatus({ ...gameStatus, level })} />;
	} else if (name === 'VS Person' && needToInviteFriend === null) {
		return (
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
		);
	} else if (needToInviteFriend) {
		return (
			<InviteFriend
				setGameObj={setGameObj}
				setIsRandomPlayer={() =>
					setGameStatus({ ...gameStatus, needToInviteFriend: false })
				}
				setSocket={setSocket}
				socket={socket}
			/>
		);
	} else if (!winner) {
		return (
			<GamePlay
				level={level || 'person'}
				socketDetails={socket}
				resetLevel={resetLevel}
				setGameObj={setGameObj}
				gameObj={gameObj}
				winner={winner}
				setWinner={res => setGameStatus({ ...gameStatus, winner: res })}
			/>
		);
	}
	return (
		<Result
			res={winner}
			resetLevel={name === 'VS AI' && resetLevel}
			resetBoard={() => setGameStatus({ ...gameStatus, winner: null })}
			typeGame={'tic_tac_toe'}
			isOnline={name !== 'VS AI'}
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
			name: 'VS Person',
			needToInviteFriend: false,
		});
		socket.emit('join-room', room.id_room);
	});
}
