import React from 'react';
import { BASE_URL } from '../../api/axios';
import styled from 'styled-components';
import Card from './Card';

import Icon from '../Icon';
import ChatBox from '../TicTacToe/ChatBox';

export default function Cards({ cards, gameType, clickHandler, userCanClick }) {
	console.log('cards: ', cards);
	return (
		<LayoutStyle>
			<CardsContainer cards={cards.length}>
				{cards.map((card, i) => {
					return (
						<Card
							key={i}
							click={userCanClick}
							isOpen={card.isOpen}
							isMatch={card.isMatched}
							imgUrl={
								BASE_URL +
								'/' +
								// (gameType === 'VS Person' ? card._doc.img_url : card.img_url)
								(gameType === 'VS Person' ? card._doc.img_url : card.img_url)
							}
							alt={card.description}
							index={i}
							clickHandler={clickHandler}
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
