import React from 'react';
import styled from 'styled-components';

export default function ProfilePic({ src }) {
	return (
		<PicContainer>
			<img src={src} alt='user profile' />
		</PicContainer>
	);
}

const PicContainer = styled.div`
	position: absolute;
	top: -40px;
	background-color: var(--yellow);
	border: 3px solid var(--pink);
	border-radius: 50%;
	overflow: hidden;
	aspect-ratio: 1;
	img {
		transform: scale(1.4);
		width: 70px;
	}
`;
