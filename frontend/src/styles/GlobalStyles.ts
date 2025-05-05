import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html, body, #root {
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.bgDark};
    margin: 0;
    padding: 0;
  }

  body {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSize.lg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
  }

  p {
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 0;
    margin: 2px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0;
    padding: 0;
  }
`;
