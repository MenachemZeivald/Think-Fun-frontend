import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../api/axios';

const socket = io.connect(BASE_URL);

export default function InviteFriend() {
    const CONNECTED = 1;
    const DISCONNECTED = -1;
    const WAITING_FOR_CONNECT = 0;

    const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
    //const [userSign, setUserSign] = useState(level === 'person' ? null : 'X');
    const [gameObj, setGameObj] = useState();
    const [url, setUrl] = useState('');

    useEffect(() => {
        socket.on('connect', () => console.log(socket.id));
        socket.emit('invite-friend-to-game');
        socket.on('invite-friend-to-game', (id_room) => {
            //setUrl(`https://think-fun.online/room/${id_room}`);
            setUrl(`http://localhost:3000/room/${id_room}`);
            console.log(url);
        });
        socket.on('game-started', (room) => {
            setConnection(CONNECTED);
            setGameObj(room);
            //setUserSign(socket.id === room.idPlayer1 ? 'X' : 'O');
            socket.emit('join-room', room.id_room);
        });
    }, []);
    const message = `Looking for a fun way to challenge your mind?\nCheck out Think-Fun - it's a website full of entertaining thinking games that will put your brain to the test.\nI've been hooked lately and would love to challenge you to a game.\nJust click on the link below to sign up and start playing. Let me know when you've joined so we can start a game together.\n\n\n`;
    const shareOnWhatsApp = () => {
        const link = `whatsapp://send?text=${encodeURIComponent(message)} ${encodeURIComponent(url)}`;
        window.open(link);
    };

    const shareOnTelegram = () => {
        const link = `https://telegram.me/share/url?url=${encodeURIComponent(message)}&text=${encodeURIComponent(url)}`;
        window.open(link);
    };

    const shareOnMessages = () => {
        const link = `sms:&body=${encodeURIComponent(message)} ${encodeURIComponent(url)}`;
        window.open(link);
    };

    return (
        <>
            {connection === WAITING_FOR_CONNECT ? (
                <div>
                    <div className='share-invite'>
                        <div className='share-invite-text'>
                            <h1>Share invite link:</h1>
                        </div>
                        <div>
                            <button className='whatsapp' onClick={shareOnWhatsApp}>
                                <a className='fa-brands fa-whatsapp'></a>
                            </button>
                            <button className='telegram' onClick={shareOnTelegram}>
                                <i className='fa-brands fa-telegram'></i>
                            </button>
                            <button className='messages' onClick={shareOnMessages}>
                                <i className='fa-solid fa-comment'></i>
                            </button>

                            <button title='copy link' className='copy' onClick={() => navigator.clipboard.writeText(url)}>
                                <i className='fa-solid fa-copy'></i>
                            </button>
                        </div>
                    </div>

                    {/* <div className='share-invite'>
            <div className='share-invite-text'>Share this invite link:</div>
            <button className='whatsapp' onClick={shareOnWhatsApp}>
              <i className='fa-brands fa-whatsapp'></i>
            </button>
            <button className='telegram' onClick={shareOnTelegram}>
              <i className='fa-brands fa-telegram'></i>
            </button>
            <button className='messages' onClick={shareOnMessages}>
              <i className='fa-solid fa-comment'></i>
            </button>
            <button className='slack' onClick={shareOnSlack}>
              <i className='fa-brands fa-slack'></i>
            </button>
          </div> */}
                </div>
            ) : (
                ''
            )}
        </>
    );
}
