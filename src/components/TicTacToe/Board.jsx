import React, { useState } from 'react';
import styled from 'styled-components';

import Square from './Square';
import ResetBtn from './ResetBtn';
import Icon from '../Icon';
import ChatBox from './ChatBox';

export default function Board({
	board,
	makeTurn,
	socketID,
	myTurn,
	winArr = [],
	resetFunc,
	vsPerson,
	helpFromGPT,
}) {
	const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);

	return (
		<LayoutStyle>
			<BoardStyle>
				{board.map((place, i) => {
					return (
						<Square
							key={i}
							place={place}
							index={i}
							clickable={myTurn && !winArr.length}
							clickHandler={makeTurn}
							findInWinArr={winArr.includes(i)}
						></Square>
					);
				})}
			</BoardStyle>
			{vsPerson && (
				<ChatBox
					socketID={socketID}
					closeChatBoxFunc={() => setIsChatBoxOpen(false)}
					isOpen={isChatBoxOpen}
					setIsOpen={setIsChatBoxOpen}
				/>
			)}
			<FooterStyle vsPerson={vsPerson}>
				{vsPerson ? (
					<Icon
						text={'question_mark'}
						clickHandler={() => helpFromGPT && myTurn && helpFromGPT()}
					/>
				) : null}
				{vsPerson || <ResetBtn resetFunc={resetFunc} clickable={winArr.length} />}
				{vsPerson && (
					<Icon
						text={'chat'}
						clickHandler={() => setIsChatBoxOpen(isChatBoxOpen => !isChatBoxOpen)}
					/>
				)}
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
	justify-content: ${p => (p.vsPerson ? 'space-between' : 'center')};
	align-items: center;
`;
