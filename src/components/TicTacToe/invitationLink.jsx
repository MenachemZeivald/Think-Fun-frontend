import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/axios';
import Result from './Result';
import GamePlay from './GamePlay';

export default function InvitationLink() {
    const { idRoom } = useParams();

    const CONNECTED = 1;
    const DISCONNECTED = -1;
    const WAITING_FOR_CONNECT = 0;

    const [socket] = useState(io.connect(BASE_URL));
    const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
    const [winner, setWinner] = useState();
    const [gameObj, setGameObj] = useState();
    useEffect(() => {
        socket.on('connect', () => console.log(socket.id));
        socket.emit('invitation-link', idRoom);
        socket.on('game-started', (room) => {
            setConnection(CONNECTED);
            console.log(room);
            setGameObj(room);
            socket.emit('join-room', room.id_room);
        });
    }, []);
    return !winner && gameObj ? (
        <GamePlay level={'person'} socketP={socket}  resetLevel={false} setGameObj={setGameObj}  gameObj={gameObj} winner={winner} setWinner={setWinner} />
    ) : winner ? (
        <Result res={winner} resetLevel={false} resetBoard={() => setWinner()} typeGame={'tic_tac_toe'} isOnline={true} level={'person'} />
    ) : (
        ''
    );
}
