import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Cards from './Cards';

export default function GamePlay({ gameType, category, setWinner }) {
	const [cards, setCards] = useState([]);

	useEffect(() => {
		getmatchingGame();
	}, []);

	const getmatchingGame = async () => {
		let url = `/games/matchingGame/?category=${category.toLowerCase()}&perPage=${9}`;
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
		tempCards[index].isOpen = true;
		setCards([...tempCards]);
	};

	const countUnmatchedCards = cards => {
		return cards.filter(card => !card.isMatched).length;
	};

	const openCards = cards.filter(card => card.isOpen);
	if (openCards.length === 2 && openCards[0]._id === openCards[1]._id) {
		setTimeout(() => {
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
		setWinner(true);
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
