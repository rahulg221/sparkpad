import { MdDeleteOutline } from "react-icons/md";
import styled from "styled-components";

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
    border-bottom: 1px solid ${({ theme }) => theme.colors.accent};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    min-height: 15vh;
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
