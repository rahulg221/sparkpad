import styled from 'styled-components';

export const Divider = styled.div`
  height: 5vh;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0 ${({ theme }) => theme.spacing.sm};
`;

export const DashboardWrapper = styled.div`
  flex: 1;
  min-height: 100vh;
  padding-right: ${({ theme }) => theme.spacing.xl};
  padding-left: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgPure};
  overflow-y: auto;

  &::-webkit-scrollbar {
    height: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
  }

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

  h1 {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSize.md};
  }

  .text-label {
    display: inline-block;

    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

