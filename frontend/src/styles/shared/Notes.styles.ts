import { styled } from "styled-components";

export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  cursor: pointer;
  box-sizing: border-box;
  height: auto;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgLight};    
  }
`;
