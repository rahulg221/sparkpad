import { styled } from "styled-components";

export const SidebarContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const DragHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;
