import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  flex: 1;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  box-sizing: border-box;
`;

export const SearchSection = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 ${({ theme }) => theme.spacing.md};
`; 

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h1 {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

export const NoteInput = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  resize: vertical;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;


