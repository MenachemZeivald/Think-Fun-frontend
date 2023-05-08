import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ResetBtn from './ResetBtn';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivet';
import useRefreshToken from '../../hooks/useRefreshToken';

export default function Result({ res, resetLevel, resetBoard, typeGame, isOnline, level = '' }) {
	const axiosPrivate = useAxiosPrivate();
	const controller = new AbortController();
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	const IS_WIN = res === 'win';
	const IS_LOSE = res === 'lose';
	const winIcons = ['Star', 'Thumb_Up', 'Mood'];
	const loseIcons = ['Cancel', 'Thumb_Down', 'mood_bad'];
	const tieIcons = ['Menu', 'sentiment_neutral'];
	const googleIcon = 'material-symbols-outlined';

	const matchingGameInit = async () => {
		try {
			let url = `/statistics/?typeGame=${typeGame}&isOnline=${isOnline}&level=${level.toLowerCase()}&gameRes=${res}`;
			const response = await axiosPrivate.put(url, {
				signal: controller.signal,
			});
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const refreshToken = async () => {
			await refresh();
		};
		console.log(auth);
		!auth?.name ? refreshToken() : matchingGameInit();
	}, [auth]);

	useEffect(() => {
		document.body.style.aspectRatio = '1';
		document.body.style.background =
			'repeating-radial-gradient(var(--blue), #78b5e4, var(--blue) 25%)';

		return () => {
			document.body.style.aspectRatio = null;
			document.body.style.background = 'var(--blue)';
		};
	}, []);

	return (
		<ResContainer>
			<ResTxt>{res === 'tie' ? res : `you ${res}!`}</ResTxt>
			<ResBtnContainer>
				{resetLevel && !isOnline && (
					<ResetBtn text={'change level'} resetFunc={resetLevel} />
				)}
				<ResetBtn text={'play again'} resetFunc={resetBoard} />
			</ResBtnContainer>
			<ResIcons>
				<div>X</div>
				<div>O</div>
				<div className={googleIcon}>
					{IS_WIN ? winIcons[0] : IS_LOSE ? loseIcons[0] : tieIcons[0]}
				</div>
				<div className={googleIcon}>
					{IS_WIN ? winIcons[1] : IS_LOSE ? loseIcons[1] : winIcons[1]}
				</div>
				<div className={googleIcon}>
					{IS_WIN ? winIcons[2] : IS_LOSE ? loseIcons[2] : tieIcons[1]}
				</div>
				<div>X</div>
				<div>O</div>
				<div className={googleIcon}>
					{IS_WIN ? winIcons[0] : IS_LOSE ? loseIcons[0] : tieIcons[0]}
				</div>
				<div className={googleIcon}>{IS_WIN ? winIcons[1] : loseIcons[1]}</div>
				<div className={googleIcon}>
					{IS_WIN ? winIcons[2] : IS_LOSE ? loseIcons[2] : tieIcons[1]}
				</div>
				<div>X</div>
				<div>O</div>
			</ResIcons>
		</ResContainer>
	);
}

const ResAnim = keyframes`
  from { bottom: -70vh; }
  to { bottom: 0; }
`;

const ResContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	position: relative;
	animation: ${ResAnim} 2s ease alternate;
	height: 70svh;
	width: 100svw;
	@media (max-device-width: 425px) {
		margin-top: 9vh;
	}
`;
const ResTxt = styled.div`
	font-size: 20vw;
	color: var(--yellow);
	-webkit-text-stroke: var(--pink) 0.02em;
	text-align: center;
	line-height: 1em;
	@media (max-device-width: 768px) {
		font-size: 17vh;
		&:lang(he) {
			font-size: 15vh;
		}
	}
`;
const ResBtnContainer = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	width: 100%;
	font-size: 5vw;
	& > * {
		width: 40%;
		padding: 1vh 0;
	}

	@media (max-device-width: 425px) {
		margin-top: 2vh;
	}
`;

const ResIcons = styled.div`
	color: var(--white);
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: -1;
	& .material-symbols-outlined {
		font-size: 100%;
	}
	& > * {
		position: absolute;
	}
	${createIconsLoations()}
`;

function createIconsLoations() {
	let iconsLocations = [
		`
		   top: 0; left: 10vw; transform: rotate(10deg)`,
		`top: 5vh; left: 60vw`,
		`top: 4vh; left: 80vw; transform: rotate(-10deg)`,
		`top: 60vh; left: 7vw; transform: rotate(10deg)`,
		`top: 3vh; left: 30vw; transform: rotate(10deg)`,
		`top: 30vh; left: 95vw; transform: rotate(-10deg)`,
		`top: 70vh; left: 20vw`,
		`top: 40vh; left: 7vw; transform: rotate(10deg)`,
		`top: 70vh; left: 80vw; transform: rotate(10deg)`,
		`top: 50vh; left: 20vw; transform: rotate(10deg)`,
		`top: 30vh; left: 48vw; transform: rotate(-10deg)`,
		`top: 70vh; left: 50vw`,
	];
	let str = ``;
	for (let index = 0; index < iconsLocations.length; index++) {
		str += `
      & div:nth-child(${index + 1}) {
        ${iconsLocations[index]};
      }
    `;
	}
	return str;
}
