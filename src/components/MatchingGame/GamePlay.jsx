import React, { useEffect, useState } from 'react';
import axios, { BASE_URL } from '../../api/axios';
import io from 'socket.io-client';
import Cards from './Cards';
import LoadingGif from '../games/LoadingGif';

export default function GamePlay({ level, gameType, category, setWinner }) {
  const CONNECTED = 1;
  const DISCONNECTED = -1;
  const WAITING_FOR_CONNECT = 0;

  const [socket] = useState(io(BASE_URL));
  const [cards, setCards] = useState([]);
  const [numCardsFliped, setNumCardsFliped] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState(WAITING_FOR_CONNECT);
  const [turn, setTurn] = useState(gameType === 'VS AI' ? true : false);
  const [gameObj, setGameObj] = useState();

  const openCards = cards.filter((card) => card.isOpen);
  const numOfMatchedCards = cards.filter((card) => card?.isMatched).length;

  useEffect(() => {
    if (gameType === 'VS Person') {
      socket.on('connect', () => console.log(socket?.id));
      socket.emit('start-matching-game');
      socket.on('game-started', (room) => {
        setConnectionStatus(CONNECTED);
        setGameObj(room);
        setCards(room?.cards);
        setTurn(socket?.id === room?.idPlayer1 ? true : false);
        socket.emit('join-room', room?.id_room);
      });
      return () => {
        socket.emit('disconnected');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameType === 'VS Person') {
      socket.on('active-matching-game', (gameObgReceive) => {
        let index = gameObgReceive?.index;
        setCards((cards) => {
          const tempCards = [...cards];
          tempCards[index].isOpen = true;
          return [...tempCards];
        });
      });
      socket.on('user-left', () => {
        setConnectionStatus(DISCONNECTED);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (cards?.length && numOfMatchedCards === cards?.length) setWinner(numCardsFliped >= cards?.length / 2 ? 'win' : 'lose');
  }, [cards, numOfMatchedCards, numCardsFliped, setWinner]);

  function checkIfMatched() {
    const vsPerson = gameType === 'VS Person';
    const firstCardId = vsPerson ? openCards[0]?._doc?._id : openCards[0]?._id;
    const secondCardId = vsPerson ? openCards[1]?._doc?._id : openCards[1]._id;
    const cardsToFlip = turn ? 2 : 0;

    setTimeout(() => {
      if (vsPerson) setTurn(!turn);

      if (firstCardId !== secondCardId) {
        setCards((cards) => cards.map((card) => ({ ...card, isOpen: false })));
      } else {
        setNumCardsFliped(numCardsFliped + cardsToFlip);
        setCards((cards) => {
          return cards.map((card) => {
            const cardID = vsPerson ? card?._doc?._id : card?._id;
            return cardID === firstCardId || cardID === secondCardId ? { ...card, isOpen: false, isMatched: true } : card;
          });
        });
      }
    }, 1000);
  }

  const getCards = async () => {
    let numOfCards = level === 'Easy' ? 6 : level === 'Medium' ? 12 : 18;
    let url = `/games/matchingGame/?category=${category}&perPage=${numOfCards / 2}`;
    try {
      const response = await axios.get(url);
      let cardsArr = response.data;
      cardsArr = [...cardsArr, ...cardsArr];
      cardsArr = cardsArr?.map((card) => ({ ...card, isOpen: false, isMatched: false }));
      cardsArr.sort(() => Math.random() - 0.5);
      setCards(cardsArr);
    } catch (err) {
      console.log(err);
    }
  };

  const cardClickHandler = (index) => {
    setCards((cards) => {
      const tempCards = [...cards];
      tempCards[index].isOpen = true;
      return [...tempCards];
    });
    if (gameType === 'VS Person') {
      socket.emit('active-matching-game', { ...gameObj, index });
    }
  };

  if (!cards.length && gameType !== 'VS Person') getCards();

  if (openCards.length === 2) checkIfMatched();

  if (!cards.length) {
    return <LoadingGif />;
  }

  if (connectionStatus === DISCONNECTED) {
    return <h1>user left</h1>;
  }

  return <Cards cards={cards} gameType={gameType} socketID={gameObj && [socket, gameObj.id_room]} clickHandler={cardClickHandler} userCanClick={turn && openCards.length < 2} />;
}
