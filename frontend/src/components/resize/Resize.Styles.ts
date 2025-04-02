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

  /*
  background-image: 
    radial-gradient(#d2b48c 1px, transparent 0.6px),
    radial-gradient(#e4c59e 1px, transparent 0.6px);
  background-size: 20px 20px;
  background-position: 0 0, 7px 7px;*/

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
