import styled from 'styled-components';

export const NotesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: ${({ theme }) => theme.spacing.md};


  &::-webkit-scrollbar {
    height: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
`;

export const NoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorOne};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  height: 20vh;
  width: 200px;
  min-width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  
  &:hover {
    height: auto; // Let it grow naturally
  }
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
`;

export const NoteInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
