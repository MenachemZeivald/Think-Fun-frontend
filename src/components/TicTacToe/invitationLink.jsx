import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../api/axios';

const socket = io.connect(BASE_URL);
export default function InvitationLink() {
  const { idRoom } = useParams();

  const CONNECTED = 1;
  const DISCONNECTED = -1;
  const WAITING_FOR_CONNECT = 0;

  const [connection, setConnection] = useState(WAITING_FOR_CONNECT);
  //const [userSign, setUserSign] = useState(level === 'person' ? null : 'X');
  const [gameObj, setGameObj] = useState();
  useEffect(() => {
    socket.emit('invitation-link');
    socket.on('game-started', (room) => {
      setConnection(CONNECTED);
      setGameObj(room);
      //setUserSign(socket.id === room.idPlayer1 ? 'X' : 'O');
      socket.emit('join-room', room.id_room);
    });
  }, []);
  return connection == WAITING_FOR_CONNECT ? <div>Invitation Link</div> : '';
}
