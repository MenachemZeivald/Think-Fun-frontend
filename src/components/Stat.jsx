import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DefaultStyle from '../DefaultStyle';

import useAxiosPrivate from '../hooks/useAxiosPrivet';
import { useNavigate, useLocation } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';

export default function Stat() {
  // leaderBoard on the home page
  const [stat, setStat] = useState({});
  // const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const nav = useNavigate();
  const location = useLocation();

  const statisticsInit = async () => {
    try {
      let url = '/statistics/';
      const response = await axiosPrivate.get(url, {
        signal: controller.signal,
      });
      console.log(response.data);
      setStat(response.data);
    } catch (error) {
      console.log(error);
      nav('/login', { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    statisticsInit();
  }, []);

  return !stat?._id ? (
    <img src='https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700' />
  ) : (
    <>
      <StatContainer>
        <h1>tic tac toe</h1>
        <ul>
          {Object.keys(stat?.tic_tac_toe).map((level) => {
            return level !== 'winOnline' ? (
              <ul>
                {level}
                {Object.keys(stat?.tic_tac_toe[level]).map((res) => {
                  return (
                    <li>
                      {res}: {stat?.tic_tac_toe[level][res]}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul>win online : {stat?.tic_tac_toe.winOnline}</ul>
            );
          })}
        </ul>
      </StatContainer>

      <StatContainer>
        <h1>matching game</h1>
        <ul>
          {Object.keys(stat?.matching_game).map((level) => {
            return level !== 'winOnline' ? (
              <ul>
                {level}
                {Object.keys(stat?.matching_game[level]).map((res) => {
                  return (
                    <li>
                      {res}: {stat?.matching_game[level][res]}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul>win online : {stat?.matching_game.winOnline}</ul>
            );
          })}
        </ul>
      </StatContainer>

      <StatContainer>
        <h1>checkers</h1>
        <ul>
          {Object.keys(stat?.checkers).map((level) => {
            return level !== 'winOnline' ? (
              <ul>
                {level}
                {Object.keys(stat?.checkers[level]).map((res) => {
                  return (
                    <li>
                      {res}: {stat?.checkers[level][res]}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul>win online : {stat?.checkers.winOnline}</ul>
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

  h1 {
    margin: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    font-size: 1.5rem;
    margin-top: 1rem;
    li {
      font-size: 1rem;
    }
  }
`;
