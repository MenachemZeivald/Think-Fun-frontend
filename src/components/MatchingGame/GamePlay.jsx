import React, { useEffect, useState } from 'react';
import axios, { BASE_URL } from '../../api/axios';
import io from 'socket.io-client';
import Cards from './Cards';

const socket = io.connect(BASE_URL);

export default function GamePlay({ gameType, category, setWinner }) {
  const CONNECTED = 1;
  const DISCONNECTED = -1;
  const WAITING_FOR_CONNECT = 0;
  const [counter, setCounter] = useState(0);
  const [cards, setCards] = useState([]);
  const [numOfCardsIFliped, setnumOfCardsIFliped] = useState(0);
  const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
  const [turn, setTurn] = useState(false);
  const [gameObj, setGameObj] = useState();

  useEffect(() => {
    if (gameType === 'VS Person') {
      socket.on('connect', () => console.log(socket.id));
      socket.emit('start-matching-game');
      socket.on('game-started', (room) => {
        setConnection(CONNECTED);
        setGameObj(room);
        setCards(room.cards);
        socket.id === room.idPlayer1 ? setTurn(true) : setTurn(false);
        socket.emit('join-room', room.id_room);
        console.log(room);
      });
    }
  }, []);

  useEffect(() => {
    if (gameType === 'VS Person') {
      socket.on('active-matching-game', (gameObgReceive) => {
        console.log('receive ', gameObgReceive);
        let index = gameObgReceive.index;
        console.log('index: ', index);
        setCards((cards) => {
          const tempCards = [...cards];
          tempCards[index].isOpen = true;
          return [...tempCards];
        });
        console.log(cards);
        socket.id === gameObgReceive.whose_turn ? setTurn(true) : setTurn(false);
      });
      socket.on('user-left', (message) => {
        setConnection(DISCONNECTED);
        console.log(message);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (gameType !== 'VS Person') {
      getmatchingGame();
    }
  }, []);

  const getmatchingGame = async () => {
    let url = `/games/matchingGame/?category=${category}&perPage=${9}`;
    try {
      const response = await axios.get(url);
      let cardsArr = response.data;
      let cardsArrLen = cardsArr.length;
      for (let i = 0; i < cardsArrLen; i++) {
        cardsArr[i].isOpen = false;
        cardsArr[i].isMatched = false;
        cardsArr.push({ ...cardsArr[i] });
      }
      setCards(cardsArr);
    } catch (err) {
      console.log(err);
    }
  };

  const cardClickHandler = (index) => {
    if (gameType === 'VS Person' && turn || gameType !== 'VS Person') {
      setCards((cards) => {
        const tempCards = [...cards];
        tempCards[index].isOpen = true;
        return [...tempCards];
      });
      if (gameType === 'VS Person') {
        socket.emit('active-matching-game', { ...gameObj, index });
        setCounter((prev) => prev + 1);
        if (counter === 1) {
          setTurn(false);
          setCounter(0);
        }
        console.log(cards);
      }
    }
  };

  const countUnmatchedCards = (cards) => {
    return cards.filter((card) => !card.isMatched).length;
  };

  const openCards = cards.filter((card) => card.isOpen);
  if (gameType === 'VS Person') {
    if (openCards.length === 2 && openCards[0]._doc._id === openCards[1]._doc._id) {
      setTimeout(() => {
        setnumOfCardsIFliped(numOfCardsIFliped + 2);
        setCards((cards) =>
          cards.map((card) => (card._doc._id === openCards[0]._doc._id || card._doc._id === openCards[1]._doc._id ? { ...card, isOpen: false, isMatched: true } : card))
        );
      }, 1000);
    } else if (openCards.length === 2) {
      setTimeout(() => {
        setCards((cards) => cards.map((card) => ({ ...card, isOpen: false })));
      }, 700);
    }
  }
  else{
    if (openCards.length === 2 && openCards[0]._id === openCards[1]._id) {
      setTimeout(() => {
        setnumOfCardsIFliped(numOfCardsIFliped + 2);
        setCards((cards) =>
          cards.map((card) => (card._id === openCards[0]._id || card._id === openCards[1]._id ? { ...card, isOpen: false, isMatched: true } : card))
        );
      }, 1000);
    } else if (openCards.length === 2) {
      setTimeout(() => {
        setCards((cards) => cards.map((card) => ({ ...card, isOpen: false })));
      }, 700);
    }
  }

  if (cards.length && !countUnmatchedCards(cards)) {
    console.log(countUnmatchedCards(cards));
    setWinner(numOfCardsIFliped > 9 ? 'win' : 'lose');
  }
  if (gameType === 'VS Person' && connection === WAITING_FOR_CONNECT) {
    return <h1>LOADING</h1>;
  }
  if (connection === DISCONNECTED) {
    return <h1>user left</h1>;
  }

  return <Cards cards={cards} gameType={gameType} clickHandler={cardClickHandler} userCanClick={openCards.length < 2} />;
}
