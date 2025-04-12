import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons

// Update your SearchInput to include padding for the icon
export const SearchInput = styled.input`
  background-color: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-family: inherit;
  width: 100%;
  height: 6.5vh;
  padding-left: ${({ theme }) => theme.spacing.xxl};

  &:focus {
    outline: 1px solid ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

// Create a styled component for the icon
export const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;