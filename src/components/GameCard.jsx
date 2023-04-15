import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';

export default function GameCard({ bgImg, name, link, setter }) {
	return link ? (
		<Link  to={name.replace(/\s/g, '')}>
			<GameCardStyle bgImg={bgImg}>{name}</GameCardStyle>
		</Link>
	) : (
		<GameCardStyle bgImg={bgImg} onClick={() => setter(name)}>
			{name}
		</GameCardStyle>
	);
}

const GameCardStyle = styled(DefaultStyle)`
	position: relative;
	aspect-ratio: 2;
	width: 60vmin;
	font-size: 7vmin;
	overflow: hidden;
	transition: all 0.3s;
	

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		opacity: 0;
		background-image: url(${p => p.bgImg});
		background-size: cover;
		background-position: center;
		transition: all 0.7s;
	}

	&:hover {
		border-width: 4px;
		color: transparent;
		background-color: transparent;
		&::after {
			opacity: 1;
		}
	}
`;
