import styled from "styled-components";

export const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;

  h2 {
    margin-top: ${({ theme }) => theme.spacing.md};
    text-align: center;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); 
  }
`;
export const CategoryBox = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.colorThree};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 25vh;
  width: 20vh;
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

  @media (max-width: 768px) {
    width: 18vh;
    height: 22.5vh;
  }
`;

export const CategoryTitle = styled.h2`
  @media (max-width: 768px) {
    min-height: 3.6em;
  }
`;