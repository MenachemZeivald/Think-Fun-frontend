import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

import GameCard from '../GameCard';
import GamePlay from './GamePlay';
import Result from '../TicTacToe/Result';

export default function MatchingGame() {
	const [categoryArr, setCategoryArr] = useState([]);
	const [gameType, setGameType] = useState('');
	const [choosenCategory, setChoosenCategory] = useState('');
	const [winner, setWinner] = useState(false);

	useEffect(() => {
		getCategories();
	}, []);

	const setCategoryById = categoryName => {
		console.log('categoryName', categoryName);
		let categoryId = categoryArr.filter(categoryObj => categoryObj.name === categoryName)[0];
		console.log('categoryId', categoryId.category_id);
		setChoosenCategory(categoryId.category_id);
	};

	const getCategories = async () => {
		try {
			const response = await axios.get(`/categories/`);
			setCategoryArr(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	if (!gameType) {
		return (
			<>
				<GameCard setter={setGameType} name='VS Person' />
				<GameCard setter={setGameType} name='VS AI' />
			</>
		);
	}
	if (!choosenCategory && gameType === 'VS Person') {
		let randomCategory =
			categoryArr[Math.floor(Math.random() * categoryArr.length)].category_id;
		setChoosenCategory(randomCategory);
	}
	if (!choosenCategory) {
		return (
			<>
				{categoryArr.map(item => (
					<GameCard key={item._id} setter={setCategoryById} name={item.name} />
				))}
			</>
		);
	}
	if (!winner) {
		return <GamePlay gameType={gameType} category={choosenCategory} setWinner={setWinner} />;
	}
	return (
		<Result
			res={'win'}
			resetBoard={() => setWinner(false)}
			typeGame={'matching_game'}
			isOnline={gameType === 'VS person'}
		/>
	);
}
