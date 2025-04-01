import { styled } from "styled-components";
export const SidebarContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;

  background-color: ${({ theme }) => theme.colors.colorFour};

  background-image: 
    radial-gradient(#d2b48c 1px, transparent 0.6px),
    radial-gradient(#e4c59e 1px, transparent 0.6px);
  background-size: 20px 20px;
  background-position: 0 0, 7px 7px;

  border-right: 2px solid #d6b88d;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: #bca98f;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9e8a6f;
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
