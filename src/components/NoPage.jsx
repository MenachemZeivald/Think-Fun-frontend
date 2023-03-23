import React from 'react';
import styled from 'styled-components';

export default function NoPage() {
	return (
		<ErrorContainer>
			<ErrorNumber>404</ErrorNumber>
			<ErrorText>Oops! Page Not Found</ErrorText>
			<ErrorMessage>Sorry, the page you are looking for cannot be found.</ErrorMessage>
			<HomeButton href='/'>Go Back to Homepage</HomeButton>
		</ErrorContainer>
	);
}

const ErrorContainer = styled.div`
	height: 80vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: 2em;
`;

const ErrorNumber = styled.h1`
	font-size: 10em;
	margin: 0;
	color: #007aff;
`;

const ErrorText = styled.h2`
	font-size: 2em;
	color: #ffcc00;
	-webkit-text-stroke: 1px #4f92c57f;
	margin-bottom: 1em;
`;

const ErrorMessage = styled.p`
	font-size: 1.2em;
	color: #007aff;
	margin-bottom: 2em;
`;

const HomeButton = styled.a`
	background-color: #ffcc00;
	color: #007aff;
	border: 1px solid #4f92c57f;
	padding: 1em 2em;
	border-radius: 5px;
	text-decoration: none;
`;
