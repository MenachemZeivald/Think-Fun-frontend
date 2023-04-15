import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const nav = useNavigate();
  const goBack = () => nav(-1);
  return (
    <ErrorContainer>
      <ErrorNumber>Unauthorized</ErrorNumber>
      <ErrorText>You do not access to the requested page.</ErrorText>
      <HomeButton onClick={goBack}>Go Back</HomeButton>
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
  font-size: 5em;
  color: #007aff;
  margin: 22px 0px;

`;

const ErrorText = styled.h2`
  font-size: 1.5em;
  color: #ffcc00;
  -webkit-text-stroke: 1px #4f92c57f;
  margin-bottom: 1em;
  margin: 22px 0px;
`;

const HomeButton = styled.a`
  background-color: #ffcc00;
  color: #007aff;
  border: 1px solid #4f92c57f;
  padding: 1em 2em;
  border-radius: 5px;
  text-decoration: none;
  margin: 22px 0px;
`;
