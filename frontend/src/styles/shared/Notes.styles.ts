import { styled } from "styled-components";

export const NoteCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
  min-height: 20vh;
  max-height: 30vh;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    height: auto; 
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    min-height: 15vh;
  }
`;

export const NewNoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 20vh;
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  
  &:hover {
    height: auto; 
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  cursor: pointer;
  box-sizing: border-box;
  height: auto;
  width: 100%;
  min-height: 5vh;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgLight};    
  }

  @media (max-width: 768px) {
    min-height: 10vh;
  }
`;


export const NotePreview = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-word;
  overflow-wrap: anywhere;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    -webkit-line-clamp: unset;
    overflow: visible;
    text-overflow: clip;
  }

  .markdown-ul {
    padding-left: 1.2rem;
    list-style-type: disc;
    margin: 0;
  }

  .markdown-li {
    margin-bottom: 0.25rem;
  }
`;

export const NotesContainer = styled.div<{ $layoutMode: 'grid' | 'list' }>`
  display: ${({ $layoutMode }) => ($layoutMode === 'list' ? 'flex' : 'grid')};
  flex-direction: ${({ $layoutMode }) => ($layoutMode === 'list' ? 'column' : 'initial')};
  grid-template-columns: ${({ $layoutMode }) =>
    $layoutMode === 'grid' ? 'repeat(3, 1fr)' : 'none'};
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: none;
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
  word-break: break-word;
  overflow-wrap: anywhere;
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
