import styled from "styled-components";

export const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0 auto;
`;

export const CategoryBox = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.colorThree};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  min-height: 22vh;
  width: 20vh;
  max-width: 90%;
  margin: 0 auto; /* ✅ removed top/bottom margin */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

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

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 22px,
      rgba(0, 0, 0, 0.1) 23px
    );
    pointer-events: none;
    z-index: 0;
  }
`;

export const CategoryName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
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