import React from 'react';
import styled from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function ResetBtn({ resetFunc, clickable, text = 'reset' }) {
	return <ResetBtnStyle onClick={() => clickable || resetFunc()}>{text}</ResetBtnStyle>;
}

const ResetBtnStyle = styled(DefaultStyle)`
	flex-wrap: wrap;
	width: fit-content;
	height: 100%;
	padding: 0.3em;
	border-width: 4px;
	/* font-size: large;
	width: fit-content;
	padding: 0.2em 0.4em;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	margin-top: 3vmin;
	border-radius: 8px;
	@media (max-device-width: 768px) {
		font-size: xx-large;
	} */
`;
