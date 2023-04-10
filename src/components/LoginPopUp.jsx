import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import DefaultStyle from '../DefaultStyle';
import useAuth from '../hooks/useAuth';
import InputButton from './Login/InputButton';
import { useNavigate } from 'react-router-dom';

export default function LoginPopUp({ blurHandler, isOpen }) {
	const divRef = useRef(null);
	const { auth } = useAuth();
	const nav = useNavigate();

	useEffect(() => {
		if (isOpen) {
			divRef.current.focus();
		}
	}, [isOpen]);

	return (
		<LoginPopUpStyle
			tabIndex={-1}
			ref={divRef}
			onBlur={blurHandler}
			bgImg={auth.profilePic}
			isOpen={isOpen}
		>
			<div></div>
			<span>name: {auth.name}</span>
			<InputButton
				text={'Edit profile'}
				clickHandler={() => {
					divRef.current.focus();
					console.log('LOLLL');
					nav('/account');
				}}
				border={'full'}
			/>
		</LoginPopUpStyle>
	);
}

const openAnim = keyframes`
	100% {
		height: 300px;
		width: 250px;
		border: 3px solid var(--pink);
	}
`;

const closeAnim = keyframes`
	0% {
		height: 300px;
		width: 250px;
	}
	100% {
		height: 0;
		width: 0;
	}
`;

const LoginPopUpStyle = styled(DefaultStyle)`
	position: absolute;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	top: 8px;
	height: 0;
	width: 0;
	border: none;
	animation: ${p => (p.isOpen ? openAnim : closeAnim)} 0.1s forwards;
	&:focus {
		outline: none;
	}
	div:first-child {
		width: 150px;
		background-image: url(${p => p.bgImg});
		background-size: contain;
		background-position: center;
		border: 3px solid var(--pink);
		border-radius: 50%;
		overflow: hidden;
		aspect-ratio: 1;
	}
`;
