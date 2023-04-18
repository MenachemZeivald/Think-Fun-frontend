import React, { useState } from 'react';

import GameCard from '../GameCard';
// import Level from './Level';
import GamePlay from './GamePlay';
import Result from '../TicTacToe/Result';

export default function Checkers() {
	const [gameType, setGameType] = useState('person');
	const [level, setLevel] = useState();
	const [winner, setWinner] = useState();

	function resetLevel() {
		setWinner();
		setLevel();
	}

	return !gameType ? (
		<>
			<GameCard setter={setGameType} name='VS Person' />
			<GameCard setter={setGameType} name='VS AI' />
		</>
	) : // ) : gameType === 'VS AI' && !level ? (
	// 	<Level setLevel={setLevel} />
	!winner ? (
		<GamePlay
			level={level || 'person'}
			// level={'AI'}
			resetLevel={resetLevel}
			winner={winner}
			setWinner={setWinner}
		/>
	) : (
		<Result
			res={winner}
			resetLevel={resetLevel}
			resetBoard={() => setWinner()}
			typeGame={'checkers'}
			isOnline={gameType !== 'VS AI'}
			level={level}
		/>
	);
}
