import styled from 'styled-components';
import { Container } from '../../styles/shared/BaseLayout';

export const ToolBarContainer = styled(Container)<{ isCollapsed: boolean }>`
    background-color: ${({ theme }) => theme.colors.bgDark};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 0;
    padding: ${({ theme }) => theme.spacing.md};
    transition: all 0.3s ease;
    width: ${({ isCollapsed }) => isCollapsed ? '4.5vw' : '18vw'};
    align-items: ${({ isCollapsed }) => isCollapsed ? 'center' : 'start'};

    @media (max-width: 768px) {
        width: ${({ isCollapsed }) => isCollapsed ? '18vw' : '75vw'};
    }
`;

export const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary};
`;


