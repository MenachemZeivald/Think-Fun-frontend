import React from 'react';
import styled from 'styled-components';

import Square from './Square';
import ResetBtn from '../TicTacToe/ResetBtn';
import Icon from '../Icon';
import ChatBox from '../TicTacToe/ChatBox';

function CheckerBoard({
	board,
	squareClickHandler,
	makeMove,
	myTurn,
	userColor,
	legalMoves,
	chosenPiece,
	resetFunc,
}) {
	return (
		<LayoutStyle>
			<Board>
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
			<ChatBox />
			<FooterStyle>
				<Icon to text={'question_mark'} />
				<ResetBtn resetFunc={resetFunc} />
				<Icon to text={'chat'} />
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
`;

const LayoutStyle = styled.div`
	display: grid;
	place-items: center;
	gap: 0.5em;
`;

const FooterStyle = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
