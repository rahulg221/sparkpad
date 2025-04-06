import { styled } from "styled-components";

export const SidebarContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.bgDark};
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.fontSize.xxl};
  }

  h2 {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }
`;