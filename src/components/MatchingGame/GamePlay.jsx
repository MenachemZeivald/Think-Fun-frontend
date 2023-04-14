import React, { useEffect, useState } from 'react';
import axios, { BASE_URL } from '../../api/axios';
import io from 'socket.io-client';
import Cards from './Cards';

const socket = io.connect(BASE_URL);

export default function GamePlay({ gameType, category, setWinner }) {
	const CONNECTED = 1;
	const DISCONNECTED = -1;
	const WAITING_FOR_CONNECT = 0;

	const [cards, setCards] = useState([]);
	const [numOfCardsIFliped, setnumOfCardsIFliped] = useState(0);
	const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
	const [turn, setTurn] = useState();
	const [gameObj, setGameObj] = useState();

	useEffect(() => {
		if (gameType === 'VS Person') {
			socket.on('connect', () => console.log(socket.id));
			//add name and image
			socket.emit('start-matching-game');
			socket.on('game-started', room => {
				setConnection(CONNECTED);
				setGameObj(room);
				setCards(room.cards);
				//setTurn(socket.id === room.idPlayer1)
				socket.emit('join-room', room.id_room);
				console.log(room);
			});
		}
	}, []);

	useEffect(() => {
		if (gameType === 'VS Person') {
			socket.on('active-matching-game', gameObgReceive => {
				console.log('receive ', gameObgReceive);
				let index = gameObgReceive.index;
				let tempCards = [...cards];
				console.log('CHECK 46:', tempCards[index]);
				tempCards[index].isOpen = true;
				setCards([...tempCards]);
				// setTurn(true)
			});
			socket.on('user-left', message => {
				setConnection(DISCONNECTED);
				console.log(message);
			});
		}
	}, [socket]);

	useEffect(() => {
		if (gameType !== 'VS Person') {
			getmatchingGame();
		}
	}, []);

	const getmatchingGame = async () => {
		let url = `/games/matchingGame/?category=${category}&perPage=${9}`;
		try {
			const response = await axios.get(url);
			let cardsArr = response.data;
			let cardsArrLen = cardsArr.length;
			for (let i = 0; i < cardsArrLen; i++) {
				cardsArr[i].isOpen = false;
				cardsArr[i].isMatched = false;
				cardsArr.push({ ...cardsArr[i] });
			}
			setCards(cardsArr);
		} catch (err) {
			console.log(err);
		}
	};

	const cardClickHandler = index => {
		let tempCards = [...cards];
		console.log('CHECK 80:', tempCards[index]);
		tempCards[index].isOpen = true;
		setCards([...tempCards]);
		if (gameType === 'VS Person') {
			socket.emit('active-matching-game', { ...gameObj, index });
		}
	};

	const countUnmatchedCards = cards => {
		return cards.filter(card => !card.isMatched).length;
	};

	const openCards = cards.filter(card => card.isOpen);
	if (openCards.length === 2 && openCards[0]._id === openCards[1]._id) {
		setTimeout(() => {
			setnumOfCardsIFliped(numOfCardsIFliped + 2);
			setCards(cards =>
				cards.map(card =>
					card._id === openCards[0]._id || card._id === openCards[1]._id
						? { ...card, isOpen: false, isMatched: true }
						: card
				)
			);
		}, 1000);
	} else if (openCards.length === 2) {
		setTimeout(() => {
			setCards(cards => cards.map(card => ({ ...card, isOpen: false })));
		}, 700);
	}

	if (cards.length && !countUnmatchedCards(cards)) {
		setWinner(numOfCardsIFliped > 9 ? 'win' : 'lose');
	}
	if (gameType === 'VS Person' && connection === WAITING_FOR_CONNECT) {
		return <h1>LOADING</h1>;
	}
	if (connection === DISCONNECTED) {
		return <h1>user left</h1>;
	}

	return (
		<Cards
			cards={cards}
			gameType={gameType}
			clickHandler={cardClickHandler}
			userCanClick={openCards.length < 2}
		/>
	);
}
