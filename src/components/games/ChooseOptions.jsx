import React from 'react';
import styled from 'styled-components';
import Option from './Option';

export default function ChooseOptions({ firstOption, secondOption, thirdOption, setter }) {
	return (
		<OptionsContainerStyle>
			<Option name={firstOption} setter={setter} />
			<Option name={secondOption} setter={setter} />
			<Option name={thirdOption} setter={setter} />
		</OptionsContainerStyle>
	);
}

const OptionsContainerStyle = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
	width: 100%;
	height: 100%;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;
