import styled from 'styled-components';

export const Divider = styled.div`
  flex: 1; /* This is the key to spacing */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5vh;
  margin: 0 8px;

  &::before {
    content: '';
    width: 1px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

export const DashboardWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  padding-right: ${({ theme }) => theme.spacing.lg};
  padding-left: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgPure};
  
  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  }
`;
