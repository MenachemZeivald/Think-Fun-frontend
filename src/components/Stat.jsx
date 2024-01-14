import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';

import LoadingGif from './games/LoadingGif';

import useAxiosPrivate from '../hooks/useAxiosPrivet';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Stat() {
	const [stat, setStat] = useState();

	const axiosPrivate = useAxiosPrivate();
	const controller = new AbortController();
	const nav = useNavigate();
	const location = useLocation();

	const statisticsInit = async () => {
		try {
			let url = '/statistics/';
			const response = await axiosPrivate.get(url, {
				signal: controller.signal,
			});
			setStat(response.data);
		} catch (error) {
			console.log(error.response);
			nav('/login', { state: { from: location }, replace: true });
		}
	};

	useEffect(() => {
		statisticsInit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!stat?._id) {
		return <LoadingGif />;
	}
	return (
		<>
			<StatContainer>
				<h1>tic tac toe</h1>
				<ul>
					{Object.keys(stat?.tic_tac_toe).map(level => {
						return level !== 'winOnline' ? (
							<li key={level}>
								<h3>{level}</h3>
								{Object.keys(stat?.tic_tac_toe[level]).map((res, i) => {
									return (
										<span key={i}>
											{res}: {stat?.tic_tac_toe[level][res]}
										</span>
									);
								})}
							</li>
						) : (
							<h3>online win: {stat?.tic_tac_toe.winOnline}</h3>
						);
					})}
				</ul>
			</StatContainer>

			<StatContainer>
				<h1>matching game</h1>
				<ul>
					{Object.keys(stat?.matching_game).map(level => {
						return level !== 'winOnline' ? (
							<li key={level}>
								<h3>{level}</h3>
								{Object.keys(stat?.matching_game[level]).map((res, i) => {
									return (
										<span key={i}>
											{res}: {stat?.matching_game[level][res]}
										</span>
									);
								})}
							</li>
						) : (
							<h3>online win: {stat?.matching_game.winOnline}</h3>
						);
					})}
				</ul>
			</StatContainer>

			<StatContainer>
				<h1>checkers</h1>
				<ul>
					{Object.keys(stat?.checkers).map(level => {
						return level !== 'winOnline' ? (
							<li key={level}>
								<h3>{level}</h3>
								{Object.keys(stat?.checkers[level]).map((res, i) => {
									return (
										<span key={i}>
											{res}: {stat?.checkers[level][res]}
										</span>
									);
								})}
							</li>
						) : (
							<h3>online win: {stat?.checkers.winOnline}</h3>
						);
					})}
				</ul>
			</StatContainer>
		</>
	);
}

const StatContainer = styled(DefaultStyle)`
	border-radius: 10px;
	box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.3);
	padding: 20px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	cursor: auto;
	width: 30vw;

	h1 {
		margin: 0;
	}
	ul {
		list-style: none;
		padding: 0;
		font-size: 1.5rem;
		margin-top: 1rem;
	}

	li {
		font-size: 18px;
		margin-bottom: 10px;
		width: 100%;
		span {
			padding: 8px;
		}
	}

	h3 {
		text-decoration: underline var(--pink);
	}

	@media (max-width: 768px) {
		width: 80%;
		margin: 20px 0;
	}
`;
