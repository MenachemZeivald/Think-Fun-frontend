import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function InputButton({ type, text, clickHandler, border, marginBottom, padding }) {
	return (
		<InputButtonStyle
			onClick={() => (clickHandler ? clickHandler() : undefined)}
			as='button'
			type={type}
			border={border}
			marginBottom={marginBottom}
			padding={padding}
		>
			{text}
		</InputButtonStyle>
	);
}

export const InputButtonStyle = styled(DefaultStyle)`
	border: none;
	box-shadow: ${p => (p.border ? '0 0 0 2px' : '0px -1.5px 0px 0px')} var(--pink) inset;
	border-radius: ${p => (p.border ? '4px' : '0px')};
	padding: ${p => p.padding || '0.5em'};
	font-family: 'Fredoka One', cursive;
	transition: all 0.5s;

	&:active,
	&:focus,
	&:hover {
		outline: none;
		border-radius: 4px;
		box-shadow: 0 0 0 2px var(--pink) inset;
		transform: scale(1.1);
	}
`;
