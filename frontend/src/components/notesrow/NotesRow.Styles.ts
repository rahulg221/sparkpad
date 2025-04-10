import styled from 'styled-components';

export const NoteContent = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
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
`;

export const NoteInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
