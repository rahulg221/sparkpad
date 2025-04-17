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
  min-height: 100vh;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-right: ${({ theme }) => theme.spacing.xl};
  padding-left: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgPure};
  
  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .text-label {
    display: inline-block;
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: 400;
    white-space: nowrap;
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

