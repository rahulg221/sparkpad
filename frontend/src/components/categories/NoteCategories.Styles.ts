import styled from "styled-components";
import { ElevatedContainer } from "../../styles/shared/BaseLayout";

export const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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
    ${({ theme }) => theme.colors.colorTwo} 18px,
    rgba(255, 255, 255, 0.03) 19px
  );

  /* Spiral binding (top row of rings) */
  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    height: 10px;
    width: 80%;
    background-image: repeating-radial-gradient(
      circle,
      ${({ theme }) => theme.colors.textLight} 0px,
      ${({ theme }) => theme.colors.textLight} 2px,
      transparent 2px,
      transparent 16px
    );
    background-size: 16px 10px;
    background-repeat: repeat-x;
    z-index: 2;
  }

  &:hover {
    transform: scale(1.03);
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;
