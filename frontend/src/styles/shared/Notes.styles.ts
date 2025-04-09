import { styled } from "styled-components";

export const NoteCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 25vh;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.bgLight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorOne};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  @media (max-width: 768px) {
    min-height: 15vh;
  }
`;


export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 15vh;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  @media (max-width: 768px) {
    min-height: 15vh;
  }
`;