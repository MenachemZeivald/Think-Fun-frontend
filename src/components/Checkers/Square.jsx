import React from 'react';
import styled from 'styled-components';

export default function Square({ squareData, makeMove, getMoves, clickable }) {
	return (
		<SquareStyle
			color={squareData.color}
			onClick={squareData.isLegalMove ? makeMove : clickable ? getMoves : null}
			isLegalMove={squareData.isLegalMove}
			chosenPiece={squareData.isChosenPiece}
		>
			{squareData.piece && <PieceStyle color={squareData.piece} />}
			{squareData.isKing && (
				<KingStyle
					color={squareData.piece}
					userColor={squareData.userColor}
					className='fas fa-crown'
				></KingStyle>
			)}
		</SquareStyle>
	);
}

const SquareStyle = styled.div`
	width: 9vmin;
	height: 9vmin;
	background-color: ${p => (p.color === 'black' ? 'var(--Dblue)' : 'var(--yellow)')};
	border: ${p => p.isLegalMove && '1px solid black'};
	border-radius: ${p => p.isLegalMove && '5px'};
	transform: ${p => p.isLegalMove && 'scale(1.12)'};
	filter: ${p => p.chosenPiece && 'brightness(1.5)'};
	z-index: ${p => p.chosenPiece && '-1'};
	transition: all 0.2s ease-in-out;
	display: flex;
	justify-content: center;
	align-items: center;
	@media (max-width: 600px) {
		width: 12vmin;
		height: 12vmin;
	}
`;

const PieceStyle = styled.div`
	width: 7vmin;
	height: 7vmin;
	background-color: ${p => p.color};
	border-radius: 50%;
	@media (max-width: 600px) {
		width: 10vmin;
		height: 10vmin;
	}
`;

const KingStyle = styled.i`
	color: ${p => (p.color === 'red' ? 'black' : 'white')};
	font-size: 4vmin;
	transform: rotate(${p => (p.userColor === 'red' ? '180deg' : '0deg')});
	position: absolute;
	@media (max-width: 600px) {
		font-size: 6vmin;
	}
`;
