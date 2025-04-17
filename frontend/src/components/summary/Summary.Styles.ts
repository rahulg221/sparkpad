import styled from 'styled-components';

export const SummaryContainer = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    height: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background-color: ${({ theme }) => theme.colors.bgDark};
    padding: ${({ theme }) => theme.spacing.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const IconButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer; 
    padding: 0;
    margin: 0;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
