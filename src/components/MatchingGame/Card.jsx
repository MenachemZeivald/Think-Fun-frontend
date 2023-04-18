import React from 'react';
import styled, { keyframes } from 'styled-components';

export default function Card({ click, index, numOfCards = 18, imgUrl, clickHandler, isOpen, isMatch }) {
  return <CardStyle isOpen={isOpen} isMatch={isMatch} cards={numOfCards} index={index} url={imgUrl} onClick={() => isOpen || !click || clickHandler(index)} />;
}

const cardsMove = keyframes`
from {transform: translate(-1000px, -1000px) rotateX(180deg)}
`;

const CardStyle = styled.div`
  position: relative;
  aspect-ratio: 5/7;
  height: ${(p) => (p.cards === 18 ? '25vh' : '30vh')};
  opacity: ${(p) => p.isMatch && '0'};
  background-color: #ff0080;
  background-image: url(${(p) => p.url});
  background-position: center;
  background-size: cover;
  border: 1px solid black;
  border-radius: 5px;
  transition: all 0.5s;
  transform: translate(0) rotateX(${(p) => (p.isOpen || p.isMatch ? '0' : '180deg')});
  animation: ${cardsMove} 0.5s ${(p) => p.index / 5}s ease-out backwards;
  transform-style: preserve-3d;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    background-color: white;
    transform: translateZ(-1px);
  }

  @media (max-device-width: 768px) {
    height: 10vh;
	width: 14vw;
  }
`;
