import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

export default function ChatBox({ blurHandler, isOpen }) {
	const divRef = useRef(null);

	useEffect(() => {
		if (isOpen) {
			divRef.current.focus();
		}
	}, [isOpen]);

	return (
		<ChatBoxStyle tabIndex={-1} ref={divRef} onBlur={blurHandler} isOpen={isOpen}>
			{isOpen && (
				<>
					<ChatHeaderStyle>
						<span>Chat Box</span>
						<span>X</span>
					</ChatHeaderStyle>
					<ChatBodyStyle>
						<ChatMessageStyle>
							<ChatBubbleStyle isSender={false}>
								<span>Hello!</span>
							</ChatBubbleStyle>
						</ChatMessageStyle>
						<ChatMessageStyle>
							<ChatBubbleStyle isSender={true}>
								<span>Hi there!</span>
							</ChatBubbleStyle>
						</ChatMessageStyle>
					</ChatBodyStyle>
					<InputFieldStyle placeholder='Type your message here...' />
				</>
			)}
		</ChatBoxStyle>
	);
}

const openAnim = keyframes`
	0% {
		
	}
	30% {
		height: 50px;
		width: 300px;
	}
	100% {
		height: 400px;
		width: 300px;
	}
`;

const closeAnim = keyframes`
	0% {
		width: 300px;
	}
	70% {
		height: 50px;
	}
	99% {
		
	}
	100% {
		height: 0;
		width: 0;
		
	}
`;

const ChatBoxStyle = styled.div`
	position: absolute;
	left: 74vw;
	top: 40%;
	display: flex;
	flex-direction: column;
	height: 0;
	width: 0;
	border-radius: 10px;
	background-color: #f5f5f5;
	animation: ${p => (p.isOpen ? openAnim : closeAnim)} 0.5s ease-in forwards;
	&:focus {
		outline: none;
	}
`;

const ChatHeaderStyle = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	padding: 0px 20px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-color: #e6e6e6;
`;

const ChatBodyStyle = styled.div`
	display: flex;
	flex-direction: column-reverse;
	padding: 20px;
`;

const ChatMessageStyle = styled.div``;

const ChatBubbleStyle = styled.div`
	display: inline-block;
	position: relative;
	max-width: calc(100% - 60px);
	margin-bottom: 0.5rem;
	padding: 0.5rem 0.75rem;
	border-radius: ${props => (props.isSender ? '1rem .5rem .5rem' : '.5rem 1rem .5rem')};
	background-color: ${props => (props.isSender ? '#dcf8c6' : '#fff')};
	color: ${props => (props.isSender ? '#000' : '#1b1b1b')};
	right: ${props => (props.isSender ? '0' : '-200px')};
`;

const InputFieldStyle = styled.input`
	height: 50px;
	width: 100%;
	border: none;
	outline: none;
	padding-left: 0.5rem;
	font-size: 0.9rem;
	border-top: solid #e6e6e6 0.5px;
	position: absolute;
	bottom: -1rem;
	border-bottom-left-radius: 0.5rem;
	border-bottom-right-radius: 0.5rem;
`;
