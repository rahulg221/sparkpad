import styled from 'styled-components';

export const CardInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Card = styled.div<{type: 'event' | 'task'}>`
  background-color: ${({ theme, type }) => type === 'event' ? theme.colors.eventBackground : theme.colors.taskBackground};
  border: 1px solid ${({ theme, type }) => type === 'event' ? theme.colors.eventColor : theme.colors.taskColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;

  max-height: 15vh;
  transition: max-height 0.5s ease, border 0.3s ease;

  &:hover {
    max-height: 40vh;
  }
`;

export const CardPreview = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-word;
  overflow-wrap: anywhere;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: all 0.4s ease-in-out;

  opacity: 1;

  ${Card}:hover & {
    -webkit-line-clamp: unset;
    display: block;
    overflow: visible;
    text-overflow: unset;
    opacity: 1;
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
