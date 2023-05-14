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
							<ul key={level}>
								{level}
								{Object.keys(stat?.tic_tac_toe[level]).map((res, i) => {
									return (
										<li key={i}>
											{res}: {stat?.tic_tac_toe[level][res]}
										</li>
									);
								})}
							</ul>
						) : (
							<ul>win online : {stat?.tic_tac_toe.winOnline}</ul>
						);
					})}
				</ul>
			</StatContainer>

			<StatContainer>
				<h1>matching game</h1>
				<ul>
					{Object.keys(stat?.matching_game).map(level => {
						return level !== 'winOnline' ? (
							<ul key={level}>
								{level}
								{Object.keys(stat?.matching_game[level]).map((res, i) => {
									return (
										<li key={i}>
											{res}: {stat?.matching_game[level][res]}
										</li>
									);
								})}
							</ul>
						) : (
							<ul>win online : {stat?.matching_game.winOnline}</ul>
						);
					})}
				</ul>
			</StatContainer>

			<StatContainer>
				<h1>checkers</h1>
				<ul>
					{Object.keys(stat?.checkers).map(level => {
						return level !== 'winOnline' ? (
							<ul key={level}>
								{level}
								{Object.keys(stat?.checkers[level]).map((res, i) => {
									return (
										<li key={i}>
											{res}: {stat?.checkers[level][res]}
										</li>
									);
								})}
							</ul>
						) : (
							<ul>win online : {stat?.checkers.winOnline}</ul>
						);
					})}
				</ul>
			</StatContainer>
		</>
	);
}

const StatContainer = styled(DefaultStyle)`
	flex-direction: column;
	padding: 1em;
	text-align: center;
	cursor: auto;
	width: 18%;

	h1 {
		margin: 0;
	}
	ul {
		list-style: none;
		padding: 0;
		font-size: 1.5rem;
		margin-top: 1rem;
		li {
			font-size: 1rem;
		}
	}

	@media (max-width: 700px) {
		width: 65%;
		margin: 12px;
	}
`;
