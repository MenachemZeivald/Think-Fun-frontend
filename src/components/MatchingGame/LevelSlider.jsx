import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function LevelSlider({ level = 'Medium', setLevel }) {
	return (
		<MainContainer>
			<LevelsContainer>
				<LevelOptionStyle choosen={level === 'Easy'} onClick={() => setLevel('Easy')}>
					Easy
				</LevelOptionStyle>
				<LevelOptionStyle choosen={level === 'Medium'} onClick={() => setLevel('Medium')}>
					Medium
				</LevelOptionStyle>
				<LevelOptionStyle choosen={level === 'Hard'} onClick={() => setLevel('Hard')}>
					Hard
				</LevelOptionStyle>
			</LevelsContainer>
		</MainContainer>
	);
}

const MainContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
`;

const LevelsContainer = styled(DefaultStyle)`
	display: flex;
	width: 48vw;
`;

const LevelOptionStyle = styled(DefaultStyle)`
	position: relative;
	width: 16vw;
	border: 0;
	font-size: 2rem;
	text-align: center;
	cursor: pointer;
	z-index: 1;
	transition: transform 0.2s ease-in-out;
	&:hover {
		transform: scale(1.2);
		border: 3px solid var(--pink);
		z-index: 3;
	}

	${p => p.choosen && 'transform: scale(1.2); border: 3px solid var(--pink); z-index: 3;'}

	& ~ div::after {
		${p => p.choosen && 'display: none;'}
		content: '';
		width: 4px;
		border-radius: 3px;
		height: 50px;
		background: var(--pink);
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}
`;
