import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function LevelSlider({ level, setLevel }) {
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
		box-shadow: 0 0 0 2px var(--pink);
		z-index: 3;
	}

	&:not(:last-child)::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		height: 70%;
		border-right: 4px solid var(--pink);
		border-width: ${p => (p.choosen ? '0' : '4px')};
		opacity: 1;
	}

	&:hover::before {
		opacity: 0;
	}

	${p => p.choosen && 'transform: scale(1.2); box-shadow: 0 0 0 2px var(--pink); z-index: 3;'}
`;
