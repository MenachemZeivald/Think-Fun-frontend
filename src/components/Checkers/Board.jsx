import React from 'react';
import styled from 'styled-components';

import Square from './Square';
import ResetBtn from '../TicTacToe/ResetBtn';
import Icon from '../Icon';
import ChatBox from '../TicTacToe/ChatBox';

export default function Board({ board, makeTurn, myTurn, winArr = [], resetFunc }) {
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
			<ChatBox />
			<FooterStyle>
				<Icon to text={'question_mark'} />
				<ResetBtn resetFunc={resetFunc} clickable={winArr.length} />
				<Icon to text={'chat'} />
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
	justify-content: space-between;
	align-items: center;
`;