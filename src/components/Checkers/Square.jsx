import React from 'react';
import styled from 'styled-components';

export default function Square({
	data,
	rowIndex,
	columnIndex,
	legalMove,
	chosenPiece,
	makeMove,
	squareClickHandler,
	clickable,
	isKing,
}) {
	return (
		<SquareStyle
			key={`${rowIndex}-${columnIndex}`}
			color={data.color}
			onClick={legalMove ? makeMove : clickable ? squareClickHandler : null}
			legalMove={legalMove}
			chosenPiece={chosenPiece}
		>
			{data.piece && <PieceStyle isKing={isKing} color={data.piece} />}
		</SquareStyle>
	);
}

const SquareStyle = styled.div`
	width: 9vh;
	height: 9vh;
	background-color: ${p => (p.color === 'black' ? 'var(--Dblue)' : 'var(--yellow)')};
	border: ${p => p.legalMove && '1px solid black'};
	border-radius: ${p => p.legalMove && '5px'};
	transform: ${p => p.legalMove && 'scale(1.12)'};
	filter: ${p => p.chosenPiece && 'brightness(1.5)'};
	transition: all 0.2s ease-in-out;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PieceStyle = styled.div`
	width: 7vh;
	height: 7vh;
	background-color: ${p => p.color};
	border: ${p => p.isKing && '4px double #fff'};
	border-radius: 50%;
`;
