import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';

export default function LoginPopUp({ blurHandler }) {
	console.log('LOL');
	// logout
	return <LoginPopUpStyle blurHandler={blurHandler}>LOL</LoginPopUpStyle>;
}

//const LoginPopUpStyle = styled(DefaultStyle)``;
const LoginPopUpStyle = styled.div`
	position: absolute;
	height: 300px;
	width: 300px;
	background-color: red;
`;
