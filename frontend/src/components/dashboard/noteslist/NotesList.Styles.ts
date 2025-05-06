import { MdDeleteOutline } from "react-icons/md";
import styled from "styled-components";
import { Container } from "../../../styles/shared/BaseLayout";

export const NoteListContainer = styled.div`
  width: 100%;
  height: 95vh;
`;

export const NoteContainer = styled(Container)<{ $isUnsorted: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  //min-height: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  height: auto;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow-y: auto;
  //border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: ${({ $isUnsorted }) => $isUnsorted ? 'none' : '15px solid black'};
  box-shadow: ${({ $isUnsorted }) => $isUnsorted ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.2)'};
  background-color: ${({ theme, $isUnsorted }) => $isUnsorted ? 'transparent' : theme.colors.cardBackground};
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgPure};

  /* Hide scrollbar by default */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }

  /* Show scrollbar on hover */
  &:hover::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
  }

  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover {
    scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
  }
`;  

export const NoteCard = styled.div<{ $layoutMode: 'grid' | 'list', $isUnsorted: boolean}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bgElevated};
  padding: ${({ theme }) => theme.spacing.lg};
  //box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme, $isUnsorted }) => $isUnsorted ? theme.colors.stickyNoteBackground : theme.colors.cardBackground};
  //border: 1px solid ${({ theme }) => theme.colors.border};
  //border-bottom: 1px solid ${({ theme, $isUnsorted }) => $isUnsorted ? theme.colors.stickyNoteBackground : theme.colors.border};
  //border-radius: ${({ theme }) => theme.borderRadius.md};
  min-height: ${({ $layoutMode }) => $layoutMode === 'list' ? '12vh' : '30vh'};
  transition: max-height 0.4s ease, min-height 0.4s ease;

  &:hover {
    //max-height: 80vh;
    background-color: ${({ theme, $isUnsorted }) => $isUnsorted ? theme.colors.stickyNoteBackground : theme.colors.bgElevated};
  }

  /* Expand the note card when focused on the textarea */
  &:has(textarea:focus) {
    min-height: 25vh;
    transition: min-height 0.4s ease;
  }

  /* Ensure the textarea expands with the card */
  & textarea:focus {
    min-height: 25vh;
    transition: min-height 0.4s ease;
  }
    
  @media (max-width: 768px) {
    max-height: 15vh;
  }
`;

export const NotePreview = styled.div<{ $layoutMode: 'grid' | 'list', $isUnsorted: boolean }>`
  color: ${({ theme, $isUnsorted }) => $isUnsorted ? theme.colors.stickyNoteColor : theme.colors.cardColor};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-word;
  overflow-wrap: anywhere;
  transition: all 0.4s ease-in-out;

  ${({ $layoutMode }) => $layoutMode === 'grid' && `
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `}

  ${NoteCard}:hover & {
    -webkit-line-clamp: unset;
    display: block;
    overflow: visible;
    text-overflow: unset;
  }

  .markdown-p {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .markdown-ul {
    padding-left: 1.2rem;
    list-style-type: disc;
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .markdown-li {
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

export const NoteInfo = styled.div<{ $isUnsorted: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  display: flex;
  flex-direction: row;
  justify-content: start;
  transition: opacity 0.3s ease;
  opacity: 0.3;

  ${NoteCard}:hover & {
    opacity: 0.8;
  }
`;
