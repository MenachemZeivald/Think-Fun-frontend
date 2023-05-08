import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function Option({ name, setter }) {
	return setter === 'link' ? (
		<Link to={name.replace(/\s/g, '')}>
			<OptionStyle>{name}</OptionStyle>
		</Link>
	) : (
		<OptionStyle onClick={() => setter(name)}>{name}</OptionStyle>
	);
}

const OptionStyle = styled(DefaultStyle)`
	aspect-ratio: 2;
	text-align: center;
	font-size: 3.5vmax;
	padding: 1rem;
	width: 30vmax;
	transition: transform 0.2s ease-in-out;
	&:hover {
		transform: scale(1.1);
	}
`;
