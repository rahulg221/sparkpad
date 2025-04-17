import styled from 'styled-components';

export const SummaryContainer = styled.div`
    min-height: 15vh;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.bgDark};
    padding: ${({ theme }) => theme.spacing.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;
