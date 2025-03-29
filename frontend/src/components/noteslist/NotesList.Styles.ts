import { MdDeleteOutline } from "react-icons/md";
import styled from "styled-components";

export const TrashIcon = styled(MdDeleteOutline)`
  width: 30px;
  height: 30px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const NotesContainer = styled.div`
  padding-bottom: calc(${({ theme }) => theme.spacing.lg} + 160px);
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

export const NoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const NoteInfo = styled.p`
  margin-top: auto;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.sm};
  display: flex;
  justify-content: space-between;
`;

export const NoteMeta = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
  height: 100%;
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;