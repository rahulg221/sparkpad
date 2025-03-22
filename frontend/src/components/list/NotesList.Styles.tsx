import styled from "styled-components";

export const NotesContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: calc(${({ theme }) => theme.spacing.lg} + 160px);
  max-width: 1200px;
  margin: 0 auto;
`;

export const NoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const NoteContent = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const NoteMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CategoryTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;