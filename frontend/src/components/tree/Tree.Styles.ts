import styled from 'styled-components';

export const TreeContainer = styled.div`
    width: 100%;
    height: 80vh;

    .rd3t-link {
    stroke: ${({ theme }) => theme.colors.border};
    stroke-width: 1.5px;
    }

    .rd3t-node circle {
    fill: transparent;
    }
`;

export const TreeNodeContent = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  line-height: 1.3;
  max-width: 100%;
  transition: all 0.2s ease;
`;

export const TreeNodeBox = styled.div<{ isCategory: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.treeNode};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.xxs};
  font-weight: ${({ isCategory }) => (isCategory ? '500' : 'normal')};
  color: ${({ theme, isCategory }) =>
    isCategory ? theme.colors.textPrimary : theme.colors.textLight};
  transition: all 0.3s ease;
  z-index: 1;
  
  &:hover {
    z-index: 100;
    height: auto;
    min-height: 100%;
    width: auto;
    min-width: 100%;
    max-width: 250px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 1px solid ${({ theme }) => theme.colors.accent};
    
    /*
    ${TreeNodeContent} {
      -webkit-line-clamp: unset;
      white-space: normal;
      overflow: visible;
    }*/
  }
`;