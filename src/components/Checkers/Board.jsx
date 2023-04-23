import React, { useState } from 'react';
import styled from 'styled-components';

import Square from './Square';
import ResetBtn from '../TicTacToe/ResetBtn';
import Icon from '../Icon';
import ChatBox from '../TicTacToe/ChatBox';

function CheckerBoard({
	board,
	squareClickHandler,
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
					row.map((square, columnIndex) => (
						<Square
							key={`${rowIndex}-${columnIndex}`}
							data={square}
							rowIndex={rowIndex}
							columnIndex={columnIndex}
							clickable={myTurn && userColor === square.piece}
							isKing={square.isKing}
							chosenPiece={
								chosenPiece &&
								chosenPiece[0] === rowIndex &&
								chosenPiece[1] === columnIndex
							}
							userColor={userColor}
							legalMove={legalMoves.some(
								move => move[0] === rowIndex && move[1] === columnIndex
							)}
							squareClickHandler={() =>
								squareClickHandler(rowIndex, columnIndex, square)
							}
							makeMove={() => makeMove(rowIndex, columnIndex)}
						/>
					))
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
	grid-template-columns: repeat(8, 9vh);
	grid-template-rows: repeat(8, 9vh);
	border: 5px solid var(--pink);
	border-radius: 1%;
	transform: ${p => p.color === 'red' && 'rotate(180deg)'} rotateY(180deg);
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
