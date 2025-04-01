import styled from "styled-components";

export const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0 auto;
`;

export const CategoryBox = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.colorThree};
  border: 1.5px solid ${({ theme }) => theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: visible;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }

  /* Folder Tab */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 12px;
    width: 60px;
    height: 15px;
    background-color: ${({ theme }) => theme.colors.colorTwo};
    border: 1.5px solid ${({ theme }) => theme.colors.textPrimary};
    border-bottom: none;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    z-index: 1;
  }
`;

export const CategoryName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
`;
