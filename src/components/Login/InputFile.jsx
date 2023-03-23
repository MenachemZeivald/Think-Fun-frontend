import React from 'react';
import styled from 'styled-components';
import { LabelStyle } from './InputField';
import { InputButtonStyle } from './InputButton';

export default function InputFile({ label, onChange, btnText }) {
	return (
		<LabelStyle>
			{label}
			<InputFileStyle type='file' name='myImage' accept='image/*' onChange={onChange} />
			<InputButtonStyle border='full'>{btnText}</InputButtonStyle>
		</LabelStyle>
	);
}

const InputFileStyle = styled.input`
	display: none;
`;
