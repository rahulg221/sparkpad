import styled from "styled-components";

// Form wrapper pinned at bottom
export const TextBarForm = styled.form`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  z-index: 100;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export const InputBarContainer = styled.div<{ isInputBarVisible: boolean }>`
  position: relative;
  width: 600px;
  max-width: 90%;
  transform: ${({ isInputBarVisible }) => (isInputBarVisible ? 'translateY(0)' : 'translateY(100px)')};
  transition: transform 0.4s ease;
`;

export const TextInput = styled.textarea`
  width: 100%;
  height: 55px;
  padding-top: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  padding-left: ${({ theme }) => theme.spacing.xl};
  padding-right: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 30px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  resize: none;
  line-height: 1.5;
  font-family: inherit;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    height: 120px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const SubmitButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 50%;
  color: black;
  cursor: pointer;
`;

// Hint for dates (you already had this)
export const DateHint = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  display: flex;
  align-items: center;
  flex-direction: row;
  position: absolute;
  right: 20px;
  bottom: -25px;
  gap: ${({ theme }) => theme.spacing.sm};
`;
