import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

:root {
    --yellow: #FFE45E;
    --white: #d9ddef;
    --pink: #FF6392;
    --blue: #7FC8F8;
    --Dblue: #4f92c5;
    --green: #20a18a
}

body {
    margin: 0;
    background: var(--blue);
    font-family: 'Fredoka One', cursive;
    min-width: 350px;
}

*:lang(he) {
  font-family: 'Suez One', serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  text-decoration: none;
  user-select: none;
}
a{
  text-decoration: none;
}
`;

export default GlobalStyle;
