import React, { useEffect, useState } from 'react';
import axios, { BASE_URL } from '../../api/axios';
import styled from 'styled-components';
import Card from './Card';

import Icon from '../Icon';
import ChatBox from '../TicTacToe/ChatBubble';

export default function Cards({ category = 'animals', numOfCards = 18 }) {
	const [cards, setCards] = useState([]);
	useEffect(() => {
		getmatchingGame();
	}, []);

	const getmatchingGame = async () => {
		let url = `/games/matchingGame/?category=${category}&perPage=${numOfCards / 2}`;
		try {
			const response = await axios.get(url);
			console.log(response.data);
			setCards(response.data);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<LayoutStyle>
			<CardsContainer cards={cards.length}>
				{cards.map((v, i) => {
					return (
						<Card
							key={v._id}
							click={true}
							imgUrl={BASE_URL + '/' + v.img_url}
							alt={v.description}
							numOfCards={numOfCards}
							index={i}
						/>
					);
				})}
			</CardsContainer>
			<ChatBox />
			<FooterStyle>
				<Icon to text={'chat'} />
			</FooterStyle>
		</LayoutStyle>
	);
}

const CardsContainer = styled.div`
	display: grid;
	// TODO: change props name
	grid-template-columns: repeat(${({ cards }) => (cards === 6 ? '3' : '6')}, 1fr);
	grid-template-rows: ${({ cards }) => Math.max(2, cards / 6)};
	gap: 1rem;
`;
const LayoutStyle = styled.div`
	display: grid;
	place-items: center;
	gap: 0.5em;
	& > div:nth-child(2) {
		border: 1px solid black;
	}
`;

const FooterStyle = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;
