import React from 'react';
import styled from 'styled-components';

export default function LoadingGif() {
	// useEffect(() => {
	// 	let timer = setTimeout(() => {
	// 		window.history.back();
	// 	}, 5000);
	// 	return () => {
	// 		clearTimeout(timer);
	// 	};
	// }, []);

	let imgSrc =
		'https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700';
	return <ImgStyle src={imgSrc} alt={'Loading gif'} />;
}

const ImgStyle = styled.img`
	width: 60vw;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	@media (max-width: 768px) {
		width: 100vw;
	}
`;
