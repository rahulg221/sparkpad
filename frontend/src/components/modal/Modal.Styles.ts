import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.overlay};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.textLight};
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
  width: auto;   
  max-width: 40vw;
  max-height: 80vh;       
  background: ${({ theme }) => theme.colors.bgDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

export const CategoryHeader = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.bgLight};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  .helper-text {
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: 400;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ModalContent = styled.div`      
  overflow-y: auto;
  min-height: 20vh;
  min-width: 30vw;
  padding-top: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgLight};
`;

export const ModalFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-self: flex-end;
  width: 50%;
  height: 6.5vh;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.accent};
  }
`;