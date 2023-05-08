import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/axios';

import GameCard from '../GameCard';
import GamePlay from './GamePlay';
import InviteFriend from '../TicTacToe/inviteFriend';
import LevelSlider from './LevelSlider';
import Result from '../TicTacToe/Result';

export default function MatchingGame() {
	const { idRoom } = useParams();

	const [gameStatus, setGameStatus] = useState({
		gameType: null,
		needToInviteFriend: null,
		level: null,
		category: null,
		winner: null,
	});

	const [gameObj, setGameObj] = useState();
	const [socket, setSocket] = useState();
	const [categoryArr, setCategoryArr] = useState([]);

	const { gameType, needToInviteFriend, level, category, winner } = gameStatus;

	useEffect(() => {
		getCategories();
	}, []);

	const setCategoryById = categoryName => {
		let categoryId = categoryArr.filter(categoryObj => categoryObj.name === categoryName)[0];
		setGameStatus({ ...gameStatus, category: categoryId.category_id });
	};

	const getCategories = async () => {
		try {
			const response = await axios.get(`/categories/`);
			setCategoryArr(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	if (idRoom && !socket) setSocket(io.connect(BASE_URL));

	if (idRoom && socket && !gameObj)
		connectToRoom(socket, idRoom, gameStatus, setGameObj, setGameStatus);

	if (!gameType) {
		return (
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
		);
	}
	if (gameType === 'VS Person' && needToInviteFriend === null) {
		return (
			<>
				<GameCard
					setter={() => setGameStatus({ ...gameStatus, needToInviteFriend: false })}
					name='Random Player'
				/>
				<GameCard
					setter={() => setGameStatus({ ...gameStatus, needToInviteFriend: true })}
					name='Invite Friend'
				/>
			</>
		);
	}
	if (needToInviteFriend) {
		return (
			<InviteFriend
				game={'MatchingGame'}
				setGameObj={setGameObj}
				setIsRandomPlayer={() =>
					setGameStatus({ ...gameStatus, needToInviteFriend: false })
				}
				setSocket={setSocket}
				socket={socket}
			/>
		);
	}
	if (!category && gameType === 'VS Person') {
		let randomIndex = Math.floor(Math.random() * categoryArr.length);
		let randomCategory = categoryArr[randomIndex].category_id;
		setGameStatus({ ...gameStatus, category: randomCategory });
	}

	if ((!category || !level) && gameType === 'VS AI') {
		return (
			<>
				<LevelSlider
					level={level}
					setLevel={level => setGameStatus({ ...gameStatus, level })}
				/>
				{categoryArr.map(item => (
					<GameCard key={item._id} setter={setCategoryById} name={item.name} />
				))}
			</>
		);
	}
	if (!winner) {
		return (
			<GamePlay
				level={level}
				gameType={gameType}
				category={category}
				winner={winner}
				setWinner={res => setGameStatus({ ...gameStatus, winner: res })}
			/>
		);
	}
	return (
		<Result
			res={winner}
			resetBoard={() => setGameStatus({ ...gameStatus, winner: null })}
			typeGame={'matching_game'}
			level={gameType === 'VS Person' ? '' : level}
			isOnline={gameType === 'VS Person'}
		/>
	);
}

function connectToRoom(socket, idRoom, gameStatus, setGameObj, setGameStatus) {
	socket.on('connect', () => console.log(socket.id));
	socket.emit('invitation-link', idRoom);
	socket.on('game-started', room => {
		setGameObj(room);
		console.log(room);
		setGameStatus({
			...gameStatus,
			gameType: 'VS Person',
			needToInviteFriend: false,
		});
		socket.emit('join-room', room.id_room);
	});
}
