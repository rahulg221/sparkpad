import styled from 'styled-components';

export const TextBarContainer = styled.div`
  width: 20%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
`;

export const TextBarForm = styled.form`
  position: relative;
  height: 50%;
  display: flex;
  flex-direction: column;
`;

export const TextInput = styled.textarea`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  resize: none;
  line-height: 1.5;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const SubmitButton = styled.button`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bgLight};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;