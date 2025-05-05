import { FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

export const Icon = styled.div`
  color: ${({ theme }) => theme.colors.looseSpark};
`;

export const NotesRowContainer = styled.div<{ $isRecentNotesVisible: boolean }>`
  width: 100%;
  max-height: ${({ $isRecentNotesVisible }) => $isRecentNotesVisible ? '300px' : '0px'};
  transition: max-height 0.4s ease, transform 0.4s ease;
  transform: ${({ $isRecentNotesVisible }) => $isRecentNotesVisible ? 'translateY(0)' : 'translateY(-100px)'};
  padding-left: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const NoteInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NewNoteCard = styled.div<{ $isUnsorted: boolean }>`
  background-color: ${({ theme }) => theme.colors.stickyNoteBackground};
  //border: 1px solid ${({ theme }) => theme.colors.border};
  //border: 1px solid ${({ theme }) => theme.colors.border};
  //border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  margin-left: 3px;
  margin-top: 3px;
  margin-bottom: 3px;
  width: 240px;
  height: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;

  min-height: 120px;
  transition: max-height 0.5s ease, border 0.3s ease;

  &:hover {
    max-height: auto;
  }
`;

export const NotePreview = styled.div<{ $isUnsorted: boolean }>`
  color: ${({ theme }) => theme.colors.stickyNoteColor};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-word;
  overflow-wrap: anywhere;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: all 0.4s ease-in-out;

  opacity: 1;

  ${NewNoteCard}:hover & {
    -webkit-line-clamp: initial;
    display: block;
    overflow: visible;
    text-overflow: unset;
    opacity: 1;
  }

  .markdown-p {
    color: ${({ theme }) => theme.colors.textPrimary};
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
