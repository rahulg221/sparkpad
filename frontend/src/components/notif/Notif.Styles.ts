import styled from 'styled-components';

export const NotificationContainer = styled.div<{ type: string }>`
  display: flex;
  position: fixed;
  bottom: 20px;
  background-color: ${({ theme, type }) => type === 'event' ? theme.colors.eventBackground : type === 'task' ? theme.colors.taskBackground : theme.colors.notifBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme, type }) => type === 'event' ? theme.colors.eventColor : type === 'task' ? theme.colors.taskColor : theme.colors.notifColor};
  font-size: ${({ theme }) => theme.fontSize.sm};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

