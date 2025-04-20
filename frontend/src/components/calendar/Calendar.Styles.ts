import styled from 'styled-components';

export const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(2 * 10vh + ${({ theme }) => theme.spacing.md});

  overflow-y: auto;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgLight};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.bgDark};
    border-radius: 4px;
  }
`;

export const EventContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.bgDark};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgLight};
    border-radius: 4px;
  }
`;

export const CardInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Card = styled.div<{ type: 'event' | 'task' }>`
  background-color: ${({ theme, type }) => type === 'event' ? theme.colors.eventBackground : theme.colors.taskBackground};  
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  width: ${({ type }) => type === 'event' ? '200px' : '100%'};
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  height: ${({ type }) => type === 'event' ? '20vh' : '10vh'};
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;

  max-height: 160px;
  transition: max-height 0.5s ease, border 0.3s ease;

  &:hover {
    max-height: 220px;
    border: 1px solid ${({ theme, type }) => type === 'event' ? theme.colors.eventColor : theme.colors.taskColor};
  }
`;

export const CardPreview = styled.div<{ type: 'event' | 'task' }>`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-word;
  overflow-wrap: anywhere;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 1;

  -webkit-line-clamp: ${({ type }) => type === 'event' ? 3 : 1};

  transition: all 0.4s ease-in-out;

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
