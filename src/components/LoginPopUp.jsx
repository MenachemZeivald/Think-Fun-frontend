import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import useRefreshToken from '../hooks/useRefreshToken';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/axios';
import useLogout from '../hooks/useLogout';

import DefaultStyle from '../DefaultStyle';
import useAuth from '../hooks/useAuth';
import InputButton from './Login/InputButton';

export default function LoginPopUp({ blurHandler, isOpen }) {
  const divRef = useRef(null);
  const { auth, setAuth } = useAuth();
  const nav = useNavigate();
  const refresh = useRefreshToken();
  const logout = useLogout();

  useEffect(() => {
    if (isOpen) {
      divRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const refreshToken = async () => {
      await refresh();
    };
    if (!auth?.name) refreshToken();
  }, [auth]);

  const signOut = async () => {
    await logout();
    setAuth({});
    nav('/');
  };

  return (
    <LoginPopUpStyle tabIndex={-1} ref={divRef} onBlur={blurHandler} bgImg={auth?.profilePic?.[0] !== 'h' ? BASE_URL + '/' + auth?.profilePic : auth?.profilePic} isOpen={isOpen}>
      <div></div>
      <span>name: {auth?.name}</span>
      <InputButton text={'Edit profile'} clickHandler={() => nav('/account')} border={'full'} />
      <InputButton text={'Your statistics'} clickHandler={() => nav('/stat')} border={'full'} />
      <InputButton text={'logout'} clickHandler={signOut} border={'full'} />
    </LoginPopUpStyle>
  );
}

const openAnim = keyframes`
	100% {
		height: 350px;
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
  animation: ${(p) => (p.isOpen ? openAnim : closeAnim)} 0.1s forwards;
  &:focus {
    outline: none;
  }
  div:first-child {
    width: 150px;
    background-image: url(${(p) => p.bgImg});
    background-size: contain;
    background-position: center;
    border: 3px solid var(--pink);
    border-radius: 50%;
    overflow: hidden;
    aspect-ratio: 1;
  }
`;
