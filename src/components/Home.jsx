import React from 'react';
import GameCard from './GameCard';
import TTTimg from '../assets/TTTphoto.png';

export default function Home() {
	const games = { 'tic tac toe': TTTimg, 'matching game': null, checkers: null, game: null };
	return (
		<>
			{Object.keys(games).map(value => (
				<GameCard name={value} key={value} bgImg={games[value]} link={true} />
			))}
		</>
	);
}
