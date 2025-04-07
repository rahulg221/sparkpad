import styled from "styled-components";

export const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};

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
    ${({ theme }) => theme.colors.colorTwo} 24px,
    rgba(255, 255, 255, 0.03) 25px
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
      ${({ theme }) => theme.colors.border} 0px,
      ${({ theme }) => theme.colors.border} 2px,
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

/*
export const CategoryBox = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.colorThree};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 22vh;
  width: 17vh;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.colorTwo};
    border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
    z-index: 1;
  }

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 18px ${({ theme }) => theme.colors.primary};
  }
`;

*/
export const CategoryName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 500;
  text-align: center;
`;

/*
export const CategoryBox = styled.div
  position: relative;
  background-color: ${({ theme }) => theme.colors.colorThree}; 
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 20vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: visible;
  margin-top: ${({ theme }) => theme.spacing.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }

 
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 0px;
    width: 100%;
    height: 12px;
    background-color: ${({ theme }) => theme.colors.colorTwo};
    border-radius: 0px 12px 0px 0px;
    z-index: 0;
  }

 
  &::after {
    content: '';
    position: absolute;
    top: -16px;
    left: 0px;
    width: 90px;
    height: 16px;
    background-color: ${({ theme }) => theme.colors.colorTwo};
    border-bottom: none;
    border-top-left-radius: 50px;
    border-top-right-radius: 100px;
    clip-path: polygon(0 0, 85% 0, 100% 100%, 0% 100%);
    z-index: 1;
  }
;
*/