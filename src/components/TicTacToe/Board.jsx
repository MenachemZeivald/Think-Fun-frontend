import React, { useState } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';

import Square from './Square';
import ResetBtn from './ResetBtn';
import Icon from '../Icon';
import ChatBox from './ChatBox';

export default function Board({ board, setBoard, makeTurn, myTurn, winArr = [], resetFunc, vsPerson, userSign }) {
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [isAskedHelp, setIsAskHelp] = useState(false);
  console.log(myTurn);
  const helpFromGPT = async () => {
    try {
      const response = await axios.post(`games/helpFromGPT/?typeGame=${'tic_tac_toe'}`, { board, sign: userSign });
      console.log(response.data);
      setIsAskHelp(true);
      setBoard((prevBoard) => {
        let tempBoard = [...prevBoard];
        tempBoard[response.data] = userSign;
        return tempBoard;
      });
      myTurn = false;
    } catch (error) {
      console.log(error.response.data);
    }
  };
  
  return (
    <LayoutStyle>
      <BoardStyle>
        {board.map((place, i) => {
          return <Square key={i} place={place} index={i} clickable={myTurn} clickHandler={makeTurn} findInWinArr={winArr.includes(i)}></Square>;
        })}
      </BoardStyle>
      {vsPerson && <ChatBox socketID={socketID} closeChatBoxFunc={() => setIsChatBoxOpen(false)} isOpen={isChatBoxOpen} setIsOpen={setIsChatBoxOpen} />}
      <FooterStyle vsPerson={vsPerson}>
      {vsPerson ? <Icon text={'question_mark'} clickHandler={() => !isAskedHelp && myTurn && helpFromGPT()} /> : null}
        {vsPerson || <ResetBtn resetFunc={resetFunc} clickable={winArr.length} />}
        {vsPerson && <Icon text={'chat'} clickHandler={() => setIsChatBoxOpen((isChatBoxOpen) => !isChatBoxOpen)} />}
      </FooterStyle>
    </LayoutStyle>
  );
}

const LayoutStyle = styled.div`
  display: grid;
  place-items: center;
  gap: 0.5em;
`;

const BoardStyle = styled.div`
  max-width: 75vh;
  width: 80vmin;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  margin: 0 auto;
  margin-top: 20px;
  border: 3px solid var(--pink);
  background-color: var(--yellow);
  @media (max-device-width: 768px) {
    width: 97vw;
    margin-top: 10vh;
    margin-bottom: 5vh;
  }
`;

const FooterStyle = styled.div`
	width: 100%;
	display: flex;
	justify-content: ${p => (p.vsPerson ? 'space-between' : 'center')};
	align-items: center;
`;
