// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import DefaultStyle from '../DefaultStyle';
// import axios from '../api/axios';

// export default function LeaderBoard() {
//   const [ticTacToe, setTicTacToe] = useState({});
//   const [matchingGame, setMatchingGame] = useState({});
//   const [checkers, setCheckers] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     getBestPlayers();
//   }, []);

//   const getBestPlayers = async () => {
//     try {
//       const response = await axios.get('/bestPlayers');
//       console.log(response.data);
//       setTicTacToe(response.data.ticTacToeBestPlayers);
//       setMatchingGame(response.data.matchingGameBestPlayers);
//       setCheckers(response.data.checkersBestPlayers);

//       setIsLoading(false);
//     } catch (error) {
//       console.log(error.response.data);
//     }
//   };
//   console.log(ticTacToe);
//   return isLoading ? (
//     <img src='https://media.tenor.com/FBeNVFjn-EkAAAAC/ben-redblock-loading.gif' />
//   ) : (
//     <>
//       <Board header={'tic tac toe'} leaders={ticTacToe} />
//       <Board header={'matching game'} leaders={matchingGame} />
//       <Board header={'checkers'} leaders={checkers} />
//     </>
//   );
// }

// function Board({ leaders, header }) {
//   return (
//     <BoardStyle>
//       <h1>{header}</h1>
//       {leaders.map((item) => (
//         <h2>{item.name + ' ' + item.numbers_of_win}</h2>
//       ))}
//     </BoardStyle>
//   );
// }

// const BoardStyle = styled(DefaultStyle)`
//   flex-direction: column;
//   padding: 1rem;
//   width: 300px;
//   h1 {
//     margin: 0;
//     padding: 10px;
//     border-bottom: 3px solid var(--pink);
//   }
// `;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';
import axios from '../api/axios';

export default function LeaderBoard() {
  const [bestPlayers, setBestPlayers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getBestPlayers();
  }, []);

  const getBestPlayers = async () => {
    try {
      const response = await axios.get('/bestPlayers');
      console.log(response.data);
      setBestPlayers(response.data);
      if (response.data.ticTacToeBestPlayers) setIsLoading(false);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return isLoading ? (
    <img src='https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700' />
  ) : (
    <>
      <StatContainer>
        <h1>tic tac toe</h1>
        <ul>
          {bestPlayers?.ticTacToeBestPlayers.map((bestPlayer) => {
            return (
              <li key={bestPlayer._id}>
                {bestPlayer.name}: {bestPlayer.numbers_of_win}
              </li>
            );
          })}
        </ul>
      </StatContainer>
      <StatContainer>
        <h1>matching game</h1>
        <ul>
          {bestPlayers?.matchingGameBestPlayers.map((bestPlayer) => {
            return (
              <li key={bestPlayer._id}>
                {bestPlayer.name}: {bestPlayer.numbers_of_win}
              </li>
            );
          })}
        </ul>
      </StatContainer>
      <StatContainer>
        <h1>checkers</h1>
        <ul>
          {bestPlayers?.checkersBestPlayers.map((bestPlayer) => {
            return (
              <li key={bestPlayer._id}>
                {bestPlayer.name}: {bestPlayer.numbers_of_win}
              </li>
            );
          })}
        </ul>
      </StatContainer>
    </>
  );
}

const StatContainer = styled(DefaultStyle)`
  flex-direction: column;
  padding: 1em;
  text-align: center;
  cursor: auto;
  width: 18%;
  height: 350px;

  h1 {
    margin: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    font-size: 2rem;
    margin-top: 2rem;
    li {
      font-size: 1.5rem;
    }
  }
`;
