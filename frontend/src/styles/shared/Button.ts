import styled, { css } from 'styled-components';

const baseButtonStyles = css`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.base};
  transition: all 0.2s ease;
`;

export const PrimaryButton = styled.button`
  ${baseButtonStyles}
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.bgLight};
`;

export const SecondaryButton = styled.button`
  ${baseButtonStyles}
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`; 