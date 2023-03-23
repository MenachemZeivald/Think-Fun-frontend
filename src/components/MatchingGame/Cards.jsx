import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Card from './Card';

export default function Cards() {
	let { cards } = useParams();
	cards = parseInt(cards);

	let list = [];
	for (let i = 0; i < cards; i++) {
		list.push(i + 1);
	}
	return (
		<CardsContainer cards={cards}>
			{list.map((v, i) => {
				return <Card key={v} click={true} numOfCards={cards} index={i} />;
			})}
		</CardsContainer>
	);
}

const CardsContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(${({ cards }) => (cards === 6 ? '3' : '6')}, 1fr);
	grid-template-rows: ${({ cards }) => Math.max(2, cards / 6)};
	gap: 1rem;
`;
