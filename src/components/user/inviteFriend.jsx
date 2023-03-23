// import io from "socket.io-client";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// const socket = io.connect("http://localhost:3002");
// //const socket = io.connect("https://think-fun.cyclic.app");
// let id_room;

// export default function InviteFriend() {
//   const [connection, setConnection] = useState(false);
//   const [disconnected, setDisconnected] = useState(false);
//   const [message, setMessage] = useState("");
//   const [url, setUrl] = useState("");
//   const [messageReceived, setMessageReceived] = useState("");
//   let isMyTurn = false;
//   const room = useParams();

//   useEffect(() => {
//     console.log(room);
//     socket.on("connect", () => console.log(socket.id));
//     socket.emit("invite-friend-to-game");
//     socket.on("invite-friend-to-game", (id_room) => {
//       setUrl(`http://localhost:3000/room/${id_room}`);
//       console.log(url);
//     });
//     socket.on("game-started", (room) => {
//       setConnection(true);
//       isMyTurn = room.whose_turn === socket.id ? true : false;
//       id_room = room.id_room;
//       console.log(isMyTurn);
//       socket.emit("join-room", id_room);
//     });
//   }, []);

//   const sendMessage = () => {
//     socket.emit("active-game", message, id_room);
//     isMyTurn = false;
//   };

//   useEffect(() => {
//     socket.on("active-game", (data, whose_turn) => {
//       setMessageReceived(data);
//       isMyTurn = whose_turn === socket.id ? true : false;
//       console.log(isMyTurn);
//     });
//     socket.on("user-left", (message) => {
//       setDisconnected(true);
//       console.log(message);
//     });
//   }, [socket]);

//   return (
//     <>
//       {!connection ? (
//         <a href={url}>{url}</a>
//       ) : disconnected ? (
//         <p>the player disconnected</p>
//       ) : (
//         <div className="container">
//           <input className="input-group-text m-4" placeholder="Message" onChange={(e) => setMessage(e.target.value)} />
//           <button className="btn btn-dark" onClick={sendMessage}>
//             Send message
//           </button>
//           <h1 className="display-4 m-4">message:</h1>
//           <p>{messageReceived}</p>
//         </div>
//       )}
//     </>
//   );
// }
