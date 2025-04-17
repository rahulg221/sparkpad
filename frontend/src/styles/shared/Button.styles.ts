import styled from 'styled-components';

export const PrimaryButton = styled.button`
  width: 100%;
  height: 6.5vh;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${({ theme }) => theme.fontSize.xs};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    height: 7.5vh;
  }
`;

export const SecondaryButton = styled.button<{ width?: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.bgDark};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  height: 7.5vh;
  width: ${({ width }) => width || '100%'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textLight};

  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.75rem;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.bgLight};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const TextButton = styled.button<{ width?: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  height: 7.5vh;  
  width: ${({ width }) => width || '100%'};    
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textLight};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const FloatingButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.textLight};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

export const IconButton = styled.button`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textLight};
    border: none;
    cursor: pointer; 
    padding: 0;
    margin: 0;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;


export const EmptyButton = styled(SecondaryButton)`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  height: 7.5vh;
  width: ${({ width }) => width || '100%'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textLight};

  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.75rem;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
