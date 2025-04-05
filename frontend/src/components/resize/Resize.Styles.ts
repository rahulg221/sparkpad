import { styled } from "styled-components";

export const SidebarContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.bgDark};

  h2 {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &::-webkit-scrollbar {
    width: 2px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.bgLight};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textLight};
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 80vw;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
`;

export const DragHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;
`;
