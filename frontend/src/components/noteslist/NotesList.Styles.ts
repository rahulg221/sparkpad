import { MdDeleteOutline } from "react-icons/md";
import styled from "styled-components";
import { Container } from "../../styles/shared/BaseLayout";

export const SmallIconButton = styled.div`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const NoteContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
  background-color: transparent;
`;  

export const NoteCard = styled.div<{ $layoutMode: 'grid' | 'list' }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;

  min-height: ${({ $layoutMode }) => $layoutMode === 'list' ? '20vh' : '35vh'};
  transition: max-height 0.5s ease, border 0.3s ease;

  &:hover {
    max-height: 80vh;
    border: 1px solid ${({ theme }) => theme.colors.accent};
  }

  @media (max-width: 768px) {
    max-height: 15vh;
  }
`;

export const NotePreview = styled.div<{ $layoutMode: 'grid' | 'list' }>`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-word;
  overflow-wrap: anywhere;
  transition: all 0.4s ease-in-out;

  ${({ $layoutMode }) =>
    $layoutMode === 'grid' ?
    `
      display: -webkit-box;
      -webkit-line-clamp: 7;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    ` :
    `
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `
  }

  ${NoteCard}:hover & {
    -webkit-line-clamp: unset;
    display: block;
    overflow: visible;
    text-overflow: unset;
  }

  .markdown-ul {
    padding-left: 1.2rem;
    list-style-type: disc;
    margin: 0.5rem 0;
  }

  .markdown-li {
    margin-bottom: 0.25rem;
  }
`;

export const NoteInfo = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
  display: flex;
  flex-direction: row;
  justify-content: start;
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
