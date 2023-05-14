import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function Form({ SubmitHandler, children, accountFormStyle }) {
	return (
		<FormStyle as='form' onSubmit={SubmitHandler} accountFormStyle={accountFormStyle}>
			{children}
		</FormStyle>
	);
}

const FormStyle = styled(DefaultStyle)`
	display: grid;
	place-items: center;
	position: relative;
	gap: 0.1rem;
	cursor: auto;

	${p =>
		p.accountFormStyle
			? `
			padding: 2em;
			aspect-ratio: initial;
			min-height: 70svh;`
			: `
			aspect-ratio: 2/3;
			padding: 2rem;
			padding-left: 50px;
			padding-right: 50px;`}

	& h1 {
		letter-spacing: 0.3rem;
		font-size: 3rem;
		margin: 0;
		margin-bottom: 1rem;
	}
	& > span {
		color: red;
	}

	@media (max-width: 700px) {
		width: 95vw;
	}
`;
