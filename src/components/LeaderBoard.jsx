import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';

export default function LeaderBoard() {
	const ticTacToe = { Alice: 98, Bob: 95, Charlie: 93, David: 89, Eve: 88 };
	const matchingGame = { Frank: 78, Grace: 76, Harry: 72, Ivy: 69, Jack: 64 };
	const checkers = { Smith: 88, Jones: 87, Brown: 85, John: 73, Miller: 72 };
	return (
		<>
			<Board header={'tic tac toe'} leaders={Object.entries(ticTacToe)} />
			<Board header={'matching game'} leaders={Object.entries(matchingGame)} />
			<Board header={'checkers'} leaders={Object.entries(checkers)} />
		</>
	);
}

function Board({ leaders, header }) {
	return (
		<BoardStyle>
			<h1>{header}</h1>
			{leaders.map(([name, score]) => (
				<h2>{name + ' ' + score}</h2>
			))}
		</BoardStyle>
	);
}

const BoardStyle = styled(DefaultStyle)`
	flex-direction: column;
	padding: 1rem;
	width: 300px;
	h1 {
		margin: 0;
		padding: 10px;
		border-bottom: 3px solid var(--pink);
	}
`;
