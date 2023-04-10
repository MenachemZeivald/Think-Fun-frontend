import React from 'react';
import styled from 'styled-components';

import ResetBtn from '../TicTacToe/ResetBtn';
import Icon from '../Icon';
import ChatBox from '../TicTacToe/ChatBubble';

const Board = styled.div`
	display: grid;
	aspect-ratio: 1;
	height: 75vh;
	grid-template-columns: repeat(8, 1fr);
	grid-template-rows: repeat(8, 1fr);
	border: 5px solid var(--pink);
	border-radius: 1%;
`;

const Square = styled.div`
	background-color: ${props => (props.black ? 'var(--Dblue)' : 'var(--yellow)')};
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
`;

const Piece = styled.div`
	background-color: ${props => props.color};
	border-radius: 50%;
	width: ${props => props.size}px;
	height: ${props => props.size}px;
`;

const CheckerBoard = () => {
	const squares = [];
	let blackPiece = [0, 2, 4, 6, 9, 11, 13, 15, 16, 18, 20, 22];
	let redPiece = [41, 43, 45, 47, 48, 50, 52, 54, 57, 59, 61, 63];
	for (let i = 0; i < 64; i++) {
		squares.push(
			<Square key={i} black={i % 2 === Math.floor(i / 8) % 2}>
				{blackPiece.includes(i) ? <Piece color='black' size={50} /> : null}
				{redPiece.includes(i) ? <Piece color='white' size={50} /> : null}
			</Square>
		);
	}
	return (
		<LayoutStyle>
			<Board>{squares}</Board>
			<ChatBox />
			<FooterStyle>
				<Icon to text={'question_mark'} />
				<ResetBtn />
				<Icon to text={'chat'} />
			</FooterStyle>
		</LayoutStyle>
	);
};

export default CheckerBoard;

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
