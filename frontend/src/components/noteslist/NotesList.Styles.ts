import { MdDeleteOutline } from "react-icons/md";
import styled from "styled-components";

interface NotesContainerProps {
  $layoutMode: 'grid' | 'list';
}

export const ElevatedContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.bgDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-sizing: border-box;
`;

export const TrashIcon = styled(MdDeleteOutline)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const NotesContainer = styled.div<NotesContainerProps>`
  display: ${({ $layoutMode }) => ($layoutMode === 'list' ? 'flex' : 'grid')};
  flex-direction: ${({ $layoutMode }) => ($layoutMode === 'list' ? 'column' : 'initial')};
  grid-template-columns: ${({ $layoutMode }) =>
    $layoutMode === 'grid' ? 'repeat(3, 1fr)' : 'none'};
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: none;
  }
`;

export const NoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorOne};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 25vh;

  &:hover {
    height: auto; // Let it grow naturally
  }

  @media (max-width: 768px) {
    min-height: 15vh;
  }
`;

export const NoteInfo = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const NoteContent = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  &:hover {
    overflow: visible;
    text-overflow: clip;
    -webkit-line-clamp: none;
  }

  @media (max-width: 768px) {
    line-clamp: 1;
  }
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

export const CategoryTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
`;