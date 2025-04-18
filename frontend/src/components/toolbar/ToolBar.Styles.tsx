import styled from 'styled-components';
import { Container } from '../../styles/shared/BaseLayout';

export const ToolBarContainer = styled(Container)<{ isToolBarCollapsed: boolean}>`
    background-color: ${({ theme }) => theme.colors.bgDark};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
    transition: all 0.3s ease;
    width: ${({ isToolBarCollapsed }) => isToolBarCollapsed ? '60px' : '220px'};
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