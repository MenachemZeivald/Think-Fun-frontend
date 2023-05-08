import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function Square({ place, index, clickHandler, clickable, findInWinArr }) {
	return (
		<>
			{place === ' ' && clickable ? (
				<SquareStyle onClick={() => clickHandler(index)}></SquareStyle>
			) : (
				<SquareStyle findInWinArr={findInWinArr}>{place}</SquareStyle>
			)}
		</>
	);
}

const SquareStyle = styled(DefaultStyle)`
	border: 3px solid var(--pink);
	aspect-ratio: 1;
	width: auto;
	border-radius: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 15vmin;
	color: ${p => p.findInWinArr && 'white'};
	-webkit-text-stroke: ${p => p.findInWinArr && 'var(--Dblue) 5px'};
	transition: all 0.7s;
`;
