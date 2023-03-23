// import io from "socket.io-client";
// import { useEffect, useState } from "react";
// const socket = io.connect("http://localhost:3002");
// //const socket = io.connect("https://think-fun.cyclic.app" );

// function RandomPlayer() {
//   const [connection, setConnection] = useState(false);
//   const [disconnected, setDisconnected] = useState(false);
//   const [message, setMessage] = useState("");
//   const [gameObg, setGameObg] = useState({});
//   const [messageReceived, setMessageReceived] = useState("");
//   let isMyTurn = false;

//   useEffect(() => {
//     socket.on("connect", () => console.log(socket.id));
//     //add name and img
//     socket.emit("start-game");
//     socket.on("game-started", (room) => {
//       setConnection(true);
//       setGameObg(room);
//       socket.emit("join-room", room.id_room);
//       isMyTurn = room.whose_turn === socket.id ? true : false;
//       console.log(room);
//     });
//   }, []);

//   const sendMessage = () => {
//     console.log(gameObg);
//     socket.emit("active-game", gameObg);
//     isMyTurn = false;
//     console.log(isMyTurn);
//   };

//   useEffect(() => {
//     socket.on("active-game", (gameObgReceive) => {
//       console.log("receive ", gameObgReceive);
//       setMessageReceived(gameObgReceive.board);
//       isMyTurn = gameObgReceive.whose_turn === socket.id ? true : false;
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
//         <p>waiting..</p>
//       ) : disconnected ? (
//         <p>the player disconnected</p>
//       ) : (
//         <div className="container">
//           <input
//             className="input-group-text m-4"
//             placeholder="Message"
//             onChange={(e) => {
//               const updatedObject = { ...gameObg, board: e.target.value };
//               setGameObg(updatedObject);
//             }}
//           />
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

// export default RandomPlayer;
