import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import useAuth from '../../hooks/useAuth';
import { BASE_URL } from '../../api/axios';

export default function ChatBox({ socketID, closeChatBoxFunc, isOpen, setIsOpen }) {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [socket, id_room] = socketID;
	const divRef = useRef(null);

	const { auth } = useAuth();

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				setIsDetailsOpen(true);
			}, 500);
		} else {
			setIsDetailsOpen(false);
		}
	}, [isOpen]);

	useEffect(() => {
		if (isDetailsOpen) {
			divRef.current.focus();
		}
	}, [isDetailsOpen]);

	useEffect(() => {
		if (socket) {
			socket.on('receiver-message', message => {
				setMessages(messages => {
					let tempMessages = [{ text: message.text, isSender: false }, ...messages];
					console.log(tempMessages);
					return tempMessages;
				});
				if (!isOpen) {
					setIsOpen(true);
				}
			});
		}
	}, [socket]);

	const sendMessage = e => {
		if (e.type === 'click' || e.key === 'Enter') {
			e.preventDefault();
			if (input !== '') {
				setMessages(messages => {
					return [{ text: input, isSender: true }, ...messages];
				});
				setInput('');
				socket.emit('send-message', { text: input, id_room });
			}
		}
	};

	return (
		<ChatBoxStyle tabIndex={-1} isOpen={isOpen}>
			{isDetailsOpen && (
				<>
					<ChatHeaderStyle>
						{Object.keys(auth).length !== 0 ? (
							<UserProfileStyle>
								<img
									src={
										auth?.profilePic?.[0] !== 'h'
											? BASE_URL + '/' + auth?.profilePic
											: auth?.profilePic
									}
									alt='profile'
								/>
								<span>{auth.name}</span>
							</UserProfileStyle>
						) : (
							<span>Chat Box</span>
						)}
						<span onClick={closeChatBoxFunc}>X</span>
					</ChatHeaderStyle>
					<ChatBodyStyle>
						{messages.map((message, i) => {
							return (
								<ChatBubbleStyle isSender={message.isSender} key={i}>
									{message.text}
								</ChatBubbleStyle>
							);
						})}
						<div></div>
					</ChatBodyStyle>
					<InputFieldStyle
						value={input}
						ref={divRef}
						onChange={e => setInput(e.target.value)}
						placeholder='Type your message here...'
						onKeyPress={sendMessage}
					/>
					<SendBtnStyle className='material-symbols-outlined' onClick={sendMessage}>
						Send
					</SendBtnStyle>
				</>
			)}
		</ChatBoxStyle>
	);
}

const ChatBoxStyle = styled.div`
	position: absolute;
	left: 74vw;
	bottom: 0;
	display: flex;
	flex-direction: column;
	height: ${p => (p.isOpen ? '400px' : '0')};
	width: 300px;
	border-radius: 10px;
	background-color: #f5f5f5;
	transition: height 0.5s ease-in-out;
	overflow: hidden;
	&:focus {
		outline: none;
	}
	@media (max-width: 768px) {
		left: 0;
		bottom: 0;
		width: 100%;
		height: ${p => (p.isOpen ? '80vh' : '0')};
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
	cursor: default;
	span {
		font-size: 1.5rem;
	}
	& > span:last-child {
		font-weight: 600;
		cursor: pointer;
	}
`;

const UserProfileStyle = styled.div`
	display: flex;
	align-items: center;
	img {
		height: 40px;
		width: 40px;
		border-radius: 50%;
		/* border: 2px solid var(--pink); */
	}
	span {
		margin-left: 10px;
	}
`;

const ChatBodyStyle = styled.div`
	display: flex;
	flex-direction: column-reverse;
	padding: 20px;
	height: calc(100% - 100px);
	overflow-y: auto;
	overflow-x: hidden;
	::-webkit-scrollbar {
		width: 0.5rem;
	}
	::-webkit-scrollbar-track {
		background-color: #f1f1f1;
	}
	::-webkit-scrollbar-thumb {
		background-color: #888;
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: #555;
	}
`;

const ChatBubbleStyle = styled.div`
	display: inline-block;
	width: fit-content;
	max-width: 60%;
	margin-bottom: 0.5rem;
	padding: 0.5rem 0.75rem;
	border-radius: ${p => (p.isSender ? '.5rem .5rem 1rem .5rem' : '.5rem .5rem .5rem 1rem')};
	background-color: ${p => (p.isSender ? '#dcf8c6' : '#fff')};
	color: ${p => (p.isSender ? '#000' : '#1b1b1b')};
	margin-left: ${p => (p.isSender ? '0' : 'auto')};
	@media (max-width: 768px) {
		max-width: 80%;
	}
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
	bottom: 0;
	border-bottom-left-radius: 0.5rem;
	border-bottom-right-radius: 0.5rem;
`;

const SendBtnStyle = styled.button`
	height: 50px;
	width: 50px;
	border: none;
	outline: none;
	padding-left: 0.5rem;
	font-size: 2rem;
	border-top: solid #e6e6e6 0.5px;
	position: absolute;
	bottom: 0;
	right: 0;
	border-bottom-left-radius: 0.5rem;
	border-bottom-right-radius: 0.5rem;
	background-color: #e6e6e6;
	cursor: pointer;
	&:hover {
		background-color: #d9d9d9;
	}
`;
