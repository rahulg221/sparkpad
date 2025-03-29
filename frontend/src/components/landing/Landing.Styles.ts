import styled from 'styled-components';

export const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgDark};
  
  background-image: radial-gradient(#ffffff11 1px, transparent 1px);
  background-size: 20px 20px;

  h2 {
    font-size: ${({ theme }) => theme.fontSize.xxl};
    margin: 0;
    padding: 0;
  }
`;

export const ContentContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.xxl} auto;
  padding: ${({ theme }) => theme.spacing.xxl};
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 300px;
`;