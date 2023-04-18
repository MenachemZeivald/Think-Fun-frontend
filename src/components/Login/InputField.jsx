import React from 'react';
import styled, { keyframes } from 'styled-components';
import DefaultStyle from '../../DefaultStyle';

export default function InputField({ label, value, type = 'text', name, placeholder, err, flexRow = false, onFocus, onChange, onBlur }) {
  return (
    <LabelStyle flexRow={flexRow}>
      {label}
      <InputFieldStyle
        as='input'
        type={type}
        value={value}
        name={name}
        isInvaild={err}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder} // err?
      />
    </LabelStyle>
  );
}

export const LabelStyle = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 0.5em;
  position: relative;

  ${(p) =>
    p.flexRow &&
    `width: 100%;
	flex-direction: row;
	justify-content: space-between;
	padding-bottom: 0;

	div {
		min-width: 50%;
		margin-bottom: 0;
	}`}

  @media (max-width: 700px) {
    font-size: 0.75rem;
  }
`;

const invaildAnimation = keyframes`
	25%{ 
		transform:translateX(4px); 
	} 

	50%{ 
		transform:translateX(-4px); 
	} 

	75%{ 
		transform:translateX(4px); 
	}
`;

const InputFieldStyle = styled(DefaultStyle)`
  margin: 5px;
  padding: 0.3em;
  border: none;
  box-shadow: ${(p) => (p.isInvaild ? '0 0 0 2px' : '0 -1.5px 0 0')} var(--pink) inset;
  border-radius: ${(p) => (p.isInvaild ? '3px' : '0')};
  color: ${(p) => (p.isInvaild ? 'red' : 'var(--Dblue)')};
  animation: ${(p) => (p.isInvaild ? invaildAnimation : 'none')} 0.3s;
  font-weight: bold;
  transition: all 0.5s;
  cursor: auto;

  &:active,
  &:focus,
  &:hover {
    outline: none;
    border-radius: 3px;
    box-shadow: 0px 0px 0px 2px var(--pink) inset;
    transform: scale(1.1);
  }

  &::placeholder {
    color: ${(p) => (p.isInvaild ? 'red' : 'var(--Dblue)')};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    border: none;
    border-bottom: 1.5px solid var(--pink);
    font-weight: bold;
    -webkit-text-fill-color: var(--Dblue);
    -webkit-box-shadow: 0 0 0px 1000px var(--yellow) inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;
