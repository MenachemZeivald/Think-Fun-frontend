import React from 'react';
import styled, { keyframes } from 'styled-components';

export default function Card({ click, index, numOfCards, imgUrl, clickHandler, isOpen, isMatch }) {
    // console.log('numOfCards', numOfCards);
    return <CardStyle isOpen={isOpen} isMatch={isMatch} cards={numOfCards} index={index} url={imgUrl} onClick={() => isOpen || !click || clickHandler(index)} />;
}

const cardsMove = keyframes`
from {transform: translate(-1000px, -1000px) rotateX(180deg)}
`;

const CardStyle = styled.div`
    position: relative;
    aspect-ratio: 5/7;
    height: 25svh;
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
        height: auto;
        width: ${(p) => (p.cards < 18 ? '28vw' : '22vw')};
    }
`;
