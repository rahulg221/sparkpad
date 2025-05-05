import styled from "styled-components";

export const NoteCategoriesContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-left: ${({ theme }) => theme.spacing.lg};
`;

export const CategoriesContainer = styled.div<{ isToolBarCollapsed: boolean, isSidebarVisible: boolean }>`
  //display: grid;
  //grid-template-columns: ${({ isToolBarCollapsed, isSidebarVisible }) => isToolBarCollapsed && !isSidebarVisible ? 'repeat(5, 1fr)' : 'repeat(3, 1fr)'};
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 18vw;
  width: 100%;
  background-color: transparent;

  @media (max-width: 768px) {
    grid-template-columns: ${({ isSidebarVisible, isToolBarCollapsed }) => isSidebarVisible || !isToolBarCollapsed ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'}; 
  }
`;

export const CategoryBox = styled.div<{ isPermanent: boolean }>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.bgLight};
  //border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 7vh;
  max-height: 100px;
  width: 5.5vh;
  max-width: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  opacity: ${({ isPermanent }) => isPermanent ? 1 : 0.6};

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
  }

  /* Right paper edge (white strip) */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: white;
    z-index: 1;
  } 

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    //border: 1px solid ${({ theme }) => theme.colors.accent};
  }
`;

export const ScratchpadBox = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.stickyNoteBackground};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  height: 5.5vh;
  max-height: 100px;
  width: 5.5vh;
  max-width: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: visible;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
  transform: rotate(-1deg);


  /* Peeling bottom corner effect */
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 30px;
    height: 30px;
    background-color: ${({ theme }) => theme.colors.stickyNoteBackground}; 
    border-radius: 0 0 5px 0;
    box-shadow: -3px -3px 5px rgba(0, 0, 0, 0.1);
    transform: rotate(5deg);
    z-index: -1;
    transition: all 0.3s ease;
  }

  /* Shadow beneath peeling corner */
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 25px;
    height: 25px;
    background: transparent;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
    z-index: -2;
  }

  &:hover {
    transform: translateY(-3px) rotate(0deg) scale(1.05);
    box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.2);
    
    /* Enhance peeling effect on hover */
    &::after {
      transform: rotate(10deg);
      bottom: -8px;
      right: -8px;
      box-shadow: -4px -4px 5px rgba(0, 0, 0, 0.15);
    }
  }
`;

export const PenIconContainer = styled.div<{ isPermanent: boolean} >`
  position: absolute;
  top: 10px;
  left: 15px;
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 3;
  opacity: ${({ isPermanent }) => isPermanent ? 1 : 0.6};
`;

export const RejectIconContainer = styled.div<{ isPermanent: boolean }>`
  position: absolute;
  top: 0px;
  right: 15px;
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 3;
  opacity: ${({ isPermanent }) => isPermanent ? 1 : 0.6};
`;

export const ThumbsIconContainer = styled.div<{ isPermanent: boolean }>`
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme, isPermanent }) => isPermanent ? theme.colors.accent : theme.colors.textFaint};

  .accept {
    &:hover {
      color: ${({ theme }) => theme.colors.success};
    }
  }

  .reject {
    &:hover {
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

export const PenIcon = styled.div`
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

export const CategoryTitle = styled.div<{ isPermanent: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, isPermanent }) => isPermanent ? theme.colors.textLight : theme.colors.textFaint};
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;

  h1 {
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme, isPermanent }) => isPermanent ? theme.colors.textLight : theme.colors.textFaint};
  }

  @media (max-width: 768px) {
    min-height: 3.6em;
  }
`;