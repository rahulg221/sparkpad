import styled from "styled-components";

export const CategoriesContainer = styled.div<{ isToolBarCollapsed: boolean, isInputVisible: boolean }>`
  display: grid;
  grid-template-columns:  repeat(5, 1fr);
  align-items: center;
  justify-content: start;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  background-color: transparent;
  padding-top: ${({ theme }) => theme.spacing.lg};

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
  background-color: ${({ theme }) => theme.colors.bgLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 15vh;
  width: 12vh;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  /* Left binding (black spine) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: black;
    z-index: 2;
    border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  }

  /* Right paper edge (white strip) */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background-color: white;
    z-index: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

export const PenIconContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 30px;
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 3;
`;

export const LockIconContainer = styled.div`
  color: ${({ theme }) => theme.colors.textFaint};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PenIcon = styled.div`
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

export const CategoryTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xxs};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    min-height: 3.6em;
  }
`;