import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  flex: 1;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  box-sizing: border-box;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h1 {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

