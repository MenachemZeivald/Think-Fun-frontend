import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/axios';

import ChooseOptions from '../games/ChooseOptions';
import Option from '../games/Option';
import GamePlay from './GamePlay';
import InviteFriend from '../games/inviteFriend';
import LevelSlider from './LevelSlider';
import Result from '../games/Result';

export default function MatchingGame() {
	const { idRoom } = useParams();

	const [gameStatus, setGameStatus] = useState({
		gameType: '',
		level: '',
		category: '',
		winner: '',
	});

	const [gameObj, setGameObj] = useState();
	const [socket, setSocket] = useState();
	const [categoryArr, setCategoryArr] = useState([]);

	const { gameType, level, category, winner } = gameStatus;

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
			<ChooseOptions
				firstOption={'VS AI'}
				secondOption={'Random Player'}
				thirdOption={'Invite Friend'}
				setter={gameType =>
					gameType === 'Random Player'
						? setGameStatus({ ...gameStatus, gameType: 'VS Person' })
						: setGameStatus({ ...gameStatus, gameType })
				}
			/>
		);
	}
	if (gameType === 'Invite Friend') {
		return (
			<InviteFriend
				game={'MatchingGame'}
				setGameObj={setGameObj}
				setIsRandomPlayer={() => setGameStatus({ ...gameStatus, gameType: 'VS Person' })}
				setSocket={setSocket}
				socket={socket}
			/>
		);
	}
	if (!category && gameType === 'VS Person') {
		let randomIndex = Math.floor(Math.random() * categoryArr.length);
		let randomCategory = categoryArr?.[randomIndex]?.category_id;
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
					<Option key={item._id} setter={setCategoryById} name={item.name} />
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
			typeGame={'matching_game'}
			level={gameType === 'VS Person' ? '' : level}
			isOnline={gameType === 'VS Person'}
			resetBoard={() => setGameStatus({ ...gameStatus, winner: '' })}
			resetLevel={() => setGameStatus({ ...gameStatus, level: '', category: '', winner: '' })}
		/>
	);
}

function connectToRoom(socket, idRoom, gameStatus, setGameObj, setGameStatus) {
	socket.on('connect', () => console.log(socket.id));
	socket.emit('invitation-link', idRoom);
	socket.on('game-started', room => {
		setGameObj(room);
		// console.log(room);
		setGameStatus({
			...gameStatus,
			gameType: 'VS Person',
		});
		socket.emit('join-room', room.id_room);
	});
}
