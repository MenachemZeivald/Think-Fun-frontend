import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';
import axios from '../api/axios';

export default function LeaderBoard() {
	const [bestPlayers, setBestPlayers] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		getBestPlayers();
	}, []);

	const getBestPlayers = async () => {
		try {
			const response = await axios.get('/bestPlayers');
			console.log(response.data);
			setBestPlayers(response.data);
			if (response.data.ticTacToeBestPlayers) setIsLoading(false);
		} catch (error) {
			console.log(error.response.data);
		}
	};

	if (isLoading) {
		let imgSrc =
			'https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700';
		return <img src={imgSrc} alt={'Loading gif'} />;
	}

	return (
		<>
			<LeaderBoardContainer>
				<h1>Leader Board </h1>
			</LeaderBoardContainer>
			<div>
				<StatContainer>
					<h1>tic tac toe</h1>
					<ul>
						{bestPlayers?.ticTacToeBestPlayers.map(bestPlayer => {
							return (
								<li key={bestPlayer._id}>
									{bestPlayer.name}: {bestPlayer.numbers_of_win}
								</li>
							);
						})}
					</ul>
				</StatContainer>
				<StatContainer>
					<h1>matching game</h1>
					<ul>
						{bestPlayers?.matchingGameBestPlayers.map(bestPlayer => {
							return (
								<li key={bestPlayer._id}>
									{bestPlayer.name}: {bestPlayer.numbers_of_win}
								</li>
							);
						})}
					</ul>
				</StatContainer>
				<StatContainer>
					<h1>checkers</h1>
					<ul>
						{bestPlayers?.checkersBestPlayers.map(bestPlayer => {
							return (
								<li key={bestPlayer._id}>
									{bestPlayer.name}: {bestPlayer.numbers_of_win}
								</li>
							);
						})}
					</ul>
				</StatContainer>
			</div>
		</>
	);
}

const StatContainer = styled(DefaultStyle)`
	border-radius: 10px;
	box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.3);
	margin: 20px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	cursor: auto;
	h1 {
		font-size: 28px;
		margin-bottom: 20px;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-weight: 600;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		font-size: 18px;
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
`;

const LeaderBoardContainer = styled.div`
	width: 100%;
	text-align: center;
	color: var(--yellow);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 40px 0;
	h1 {
		background-color: var(--pink);
		font-size: 48px;
		margin-bottom: 40px;
		text-transform: uppercase;
		color: var(--yellow);
		padding: 1rem;
		border-radius: 10px;
		box-shadow: 0px 0px 20px #1900ff;
		/* border: 3px solid var(--yellow); */
		letter-spacing: 3px;
		margin-bottom: 0;
	}
`;
// const StatContainer = styled.div`
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	background-color: var(--yellow);
// 	color: var(--Dblue);
// 	border: 3px solid var(--pink);
// 	border-radius: 10px;
// 	flex-direction: column;
// 	padding: 1em;
// 	text-align: center;
// 	cursor: auto;
// 	width: 18%;
// 	height: 350px;

// 	h1 {
// 		margin: 0;
// 	}
// 	ul {
// 		list-style: none;
// 		padding: 0;
// 		font-size: 2rem;
// 		margin-top: 2rem;
// 		li {
// 			font-size: 1.5rem;
// 		}
// 	}

// 	@media (max-width: 700px) {
// 		width: 65%;
// 		margin: 12px;
// 	}
// `;
