import styled from "styled-components";

export const CategoriesContainer = styled.div<{ isToolBarCollapsed: boolean, isInputVisible: boolean }>`
  display: grid;
  grid-template-columns:  repeat(4, 1fr);
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bgDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xl};

  h2 {
    margin-top: ${({ theme }) => theme.spacing.md};
    text-align: center;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    grid-template-columns: ${({ isInputVisible, isToolBarCollapsed }) => isInputVisible || !isToolBarCollapsed ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'}; 
  }
`;

export const CategoryBox = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.colorThree};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 20vh;
  width: 16vh;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;

  /* Simulate notepad lines */
  background-image: repeating-linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.colorTwo},
    ${({ theme }) => theme.colors.colorTwo} 14px,
    rgba(255, 255, 255, 0.03) 15px
  );

  /* Thin light grey box at the top instead of dots */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.topNotePad};
    z-index: 2;
  }

  &:hover {
    transform: scale(1.03);
    border: 1px solid ${({ theme }) => theme.colors.accent};
  }
`;

export const CategoryTitle = styled.h2`
  @media (max-width: 768px) {
    min-height: 3.6em;
  }
`;