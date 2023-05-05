import React, { useState } from 'react';
import styled from 'styled-components';

import Square from './Square';
import ResetBtn from '../TicTacToe/ResetBtn';
import Icon from '../Icon';
import ChatBox from '../TicTacToe/ChatBox';

function CheckerBoard({
	board,
	getMoves,
	makeMove,
	socketID,
	vsPerson,
	myTurn,
	userColor,
	legalMoves,
	chosenPiece,
	resetFunc,
}) {
	const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
	return (
		<LayoutStyle>
			<Board color={userColor}>
				{board.map((row, rowIndex) =>
					row.map((square, columnIndex) => {
						let isChosenPiece = chosenPiece
							? chosenPiece[0] === rowIndex && chosenPiece[1] === columnIndex
							: false;
						let isLegalMove = legalMoves.some(
							move => move[0] === rowIndex && move[1] === columnIndex
						);
						return (
							<Square
								key={`${rowIndex}-${columnIndex}`}
								squareData={{
									...square,
									userColor,
									isChosenPiece,
									isLegalMove,
								}}
								clickable={myTurn && userColor === square.piece}
								getMoves={() => getMoves(rowIndex, columnIndex, square)}
								makeMove={() => makeMove(rowIndex, columnIndex)}
							/>
						);
					})
				)}
			</Board>
			{vsPerson && (
				<ChatBox
					socketID={socketID}
					closeChatBoxFunc={() => setIsChatBoxOpen(false)}
					isOpen={isChatBoxOpen}
					setIsOpen={setIsChatBoxOpen}
				/>
			)}
			<FooterStyle vsPerson={vsPerson}>
				{vsPerson && <Icon text={'question_mark'} />}
				{vsPerson || <ResetBtn resetFunc={resetFunc} />}
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

export default CheckerBoard;

const Board = styled.div`
	display: grid;
	grid-template-columns: repeat(8, 9vmin);
	grid-template-rows: repeat(8, 9vmin);
	border: 5px solid var(--pink);
	border-radius: 1%;
	transform: ${p => p.color === 'red' && 'rotate(180deg)'} rotateY(180deg);
	@media (max-width: 600px) {
		grid-template-columns: repeat(8, 12vmin);
		grid-template-rows: repeat(8, 12vmin);
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
	justify-content: ${p => (p.vsPerson ? 'space-between' : 'center')};
	align-items: center;
`;
