import React, { useState } from 'react';
import styled from 'styled-components';

import Square from './Square';
import ResetBtn from './ResetBtn';
import Icon from '../Icon';
import ChatBox from './ChatBox';

export default function Board({ board, makeTurn, myTurn, winArr = [], resetFunc, vsPerson }) {
	const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
	// TODO: buttons just when needed, person or AI
	return (
		<LayoutStyle>
			<BoardStyle>
				{board.map((place, i) => {
					return (
						<Square
							key={i}
							place={place}
							index={i}
							clickable={myTurn}
							clickHandler={makeTurn}
							findInWinArr={winArr.includes(i)}
						></Square>
					);
				})}
			</BoardStyle>
			<ChatBox blurHandler={() => setIsChatBoxOpen(false)} isOpen={isChatBoxOpen} />
			<FooterStyle justify={vsPerson}>
				{vsPerson ? <Icon text={'question_mark'} /> : null}
				<ResetBtn resetFunc={resetFunc} clickable={winArr.length} />
				{vsPerson ? (
					<Icon text={'chat'} clickHandler={() => setIsChatBoxOpen(true)} />
				) : null}
			</FooterStyle>
		</LayoutStyle>
	);
}

const LayoutStyle = styled.div`
	display: grid;
	place-items: center;
	gap: 0.5em;
`;

const BoardStyle = styled.div`
	max-width: 75vh;
	width: 80vmin;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	margin: 0 auto;
	margin-top: 20px;
	border: 3px solid var(--pink);
	background-color: var(--yellow);
	@media (max-device-width: 768px) {
		width: 97vw;
		margin-top: 10vh;
		margin-bottom: 5vh;
	}
`;

const FooterStyle = styled.div`
	width: 100%;
	display: flex;
	justify-content: ${p => (p.justify ? 'space-between' : 'center')};
	align-items: center;
`;
