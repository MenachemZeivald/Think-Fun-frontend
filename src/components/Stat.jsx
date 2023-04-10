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

  const matchingGameInit = async () => {
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
    matchingGameInit();
  }, []);

  return !stat?._id ? (
    <h1>LOADING</h1>
  ) : (
    <>
      <StatContainer>
        <h1>Tic tac toe</h1>
        <ul>
          {Object.keys(stat?.tic_tac_toe).map((level) => {
            return (
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
            );
          })}
        </ul>
      </StatContainer>
      <StatContainer>
        <h1>Matching game</h1>
        <ul>
          {Object.keys(stat?.matching_game).map((level) => {
            return (
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
  width: 15%;

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
