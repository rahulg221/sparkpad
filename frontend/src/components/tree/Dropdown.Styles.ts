import { styled } from "styled-components";

export const DropdownWrapper = styled.div`
  position: relative;
  width: 160px;
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const DropdownHeader = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.textLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

export const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-top: 4px;
  list-style: none;
  padding: 4px 0;
  z-index: 10;
`;

export const DropdownItem = styled.li`
  padding: 6px 10px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgLight};
  }
`;
