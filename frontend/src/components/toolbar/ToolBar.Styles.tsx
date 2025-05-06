import styled from 'styled-components';
import { Container } from '../../styles/shared/BaseLayout';

export const ToolBarContainer = styled(Container)<{ isToolBarCollapsed: boolean}>`
    background-color: ${({ theme }) => theme.colors.bgPure};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    height: 100dvh;
    border-radius: 0;
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
    transition: all 0.3s ease;
    width: ${({ isToolBarCollapsed }) => isToolBarCollapsed ? '60px' : '225px'};
    align-items: ${({ isToolBarCollapsed }) => isToolBarCollapsed ? 'center' : 'start'};

    @media (max-width: 768px) {
        width: ${({ isToolBarCollapsed }) => isToolBarCollapsed ? '60px' : '180px'};
    }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;               
  height: 24px;
  border-radius: 50%;        
  background-color: ${({ theme }) => theme.colors.primary}; 
  color: black;       

  

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

export const SmallHeader = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.xxs};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textFaint};
`;