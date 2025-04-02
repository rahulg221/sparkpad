import styled from 'styled-components';

export const Divider = styled.div`
  height: 5vh;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0 12px;
`;

export const DashboardWrapper = styled.div`
  flex: 1;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.bgDark};
  background-image: radial-gradient(${({ theme }) => theme.colors.dotColor} 1px, transparent 1px);
  background-size: 20px 20px;

  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};    

  h1 {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

