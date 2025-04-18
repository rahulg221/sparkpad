import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bgDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60vw;
  max-width: 900px;
  height: 60vh;                 
  background: ${({ theme }) => theme.colors.bgLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ModalContent = styled.div`
  flex: 1 1 auto;
  height: 50vh;              
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const ModalFooter = styled.div`
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
`;
