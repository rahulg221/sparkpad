import { MdDeleteOutline } from "react-icons/md";
import styled from "styled-components";

interface NotesContainerProps {
  viewMode: 'grid' | 'list';
}

export const TrashIcon = styled(MdDeleteOutline)`
  width: 25px;
  height: 25px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const NotesContainer = styled.div<NotesContainerProps>`
  padding-bottom: calc(${({ theme }) => theme.spacing.lg} + 160px);
  max-width: 1200px;
  margin: 0 auto;
  display: ${({ viewMode }) => (viewMode === 'list' ? 'flex' : 'grid')};
  flex-direction: ${({ viewMode }) => (viewMode === 'list' ? 'column' : 'initial')};
  grid-template-columns: ${({ viewMode }) =>
    viewMode === 'grid' ? 'repeat(3, 1fr)' : 'none'};
  gap: ${({ theme }) => theme.spacing.md};
`;

export const NoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export const NoteInfo = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  display: flex;
  justify-content: space-between;
  margin-bottom: auto;
`;

export const NoteMeta = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  height: 100%;
  margin-bottom: auto;
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
  color: ${({ theme }) => theme.colors.textPrimary};
`;