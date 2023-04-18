import React from 'react';
import GameCard from './GameCard';
import TTTimg from '../assets/TTTphoto.png';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const games = { 'tic tac toe': TTTimg, 'matching game': null, checkers: null, game: null };
  return (
    <>
      {Object.keys(games).map((value) => (
        <GameCard name={value} key={value} bgImg={games[value]} link={true} />
      ))}
    </>
  );
}
