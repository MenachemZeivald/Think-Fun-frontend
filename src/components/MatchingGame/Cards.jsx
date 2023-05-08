import React, { useState } from 'react';
import styled from 'styled-components';

import { BASE_URL } from '../../api/axios';
import Card from './Card';
import Icon from '../Icon';
import ChatBox from '../games/ChatBox';

export default function Cards({ cards, gameType, socketID, clickHandler, userCanClick }) {
	const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
	return (
		<LayoutStyle>
			<CardsContainer cards={cards.length}>
				{cards.map((card, i) => {
					return (
						<Card
							key={i}
							click={userCanClick && !card.isMatched}
							isOpen={card.isOpen}
							isMatch={card.isMatched}
							imgUrl={`${BASE_URL}/${
								gameType === 'VS Person' ? card._doc.img_url : card.img_url
							}`}
							alt={card.description}
							index={i}
							numOfCards={cards.length}
							clickHandler={clickHandler}
						/>
					);
				})}
			</CardsContainer>
			{gameType === 'VS Person' && (
				<>
					<ChatBox
						socketID={socketID}
						closeChatBoxFunc={() => setIsChatBoxOpen(false)}
						isOpen={isChatBoxOpen}
						setIsOpen={setIsChatBoxOpen}
					/>
					<FooterStyle>
						<Icon
							text={'chat'}
							clickHandler={() => setIsChatBoxOpen(isChatBoxOpen => !isChatBoxOpen)}
						/>
					</FooterStyle>
				</>
			)}
		</LayoutStyle>
	);
}

const CardsContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(${p => (p.cards === 6 ? '3' : '6')}, 1fr);
	grid-template-rows: ${p => Math.max(2, p.cards / 6)};
	gap: 1rem;
	@media (max-width: 768px) {
		grid-template-columns: repeat(${p => (p.cards === 18 ? '4' : '3')}, 1fr);
		grid-template-rows: ${p => Math.max(3, p.cards / 4)};
		gap: 0.5rem;
	}
`;
const LayoutStyle = styled.div`
	display: grid;
	place-items: center;
	gap: 0.5em;
`;

const FooterStyle = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;
