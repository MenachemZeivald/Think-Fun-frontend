import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../../api/axios';

export default function InviteFriend({ setGameObj, setIsRandomPlayer, setSocket }) {
	const [url, setUrl] = useState('');

	useEffect(() => {
		const socket = io.connect(BASE_URL);
		setSocket(socket);
		socket.on('connect', () => console.log(socket.id));
		socket.emit('invite-friend-to-game');
		socket.on('invite-friend-to-game', id_room => {
			//setUrl(`https://think-fun.online/TicTacToe/${id_room}`);
			setUrl(`http://localhost:3000/TicTacToe/${id_room}`);
		});
		socket.on('game-started', room => {
			setGameObj(room);
			setIsRandomPlayer();
			socket.emit('join-room', room.id_room);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const shareLink = app => {
		const message = `Looking for a fun way to challenge your mind?\nCheck out Think-Fun - it's a website full of entertaining thinking games that will put your brain to the test.\nI've been hooked lately and would love to challenge you to a game.\nJust click on the link below to sign up and start playing. Let me know when you've joined so we can start a game together.\n\n\n`;
		if (app === 'whatsapp')
			window.open(
				`whatsapp://send?text=${encodeURIComponent(message)}${encodeURIComponent(url)}`
			);
		else if (app === 'telegram')
			window.open(
				`https://telegram.me/share/url?url=${encodeURIComponent(
					message
				)}&text=${encodeURIComponent(url)}`
			);
		else if (app === 'messages')
			window.open(`sms:&body=${encodeURIComponent(message)}${encodeURIComponent(url)}`);
		else if (app === 'copy') navigator.clipboard.writeText(url);
	};

	return (
		<div>
			<div className='share-invite'>
				<div className='share-invite-text'>
					<h1>Share invite link:</h1>
				</div>
				<div>
					<button className='whatsapp' onClick={() => shareLink('whatsapp')}>
						<i className='fa-brands fa-whatsapp'></i>
					</button>
					<button className='telegram' onClick={() => shareLink('telegram')}>
						<i className='fa-brands fa-telegram'></i>
					</button>
					<button className='messages' onClick={() => shareLink('messages')}>
						<i className='fa-solid fa-comment'></i>
					</button>
					<button title='copy link' className='copy' onClick={() => shareLink('copy')}>
						<i className='fa-solid fa-copy'></i>
					</button>
				</div>
			</div>
		</div>
	);
}
