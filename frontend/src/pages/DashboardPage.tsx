import { SideBar } from '../components/sidebar/SideBar';
import { Dashboard } from '../components/dashboard/Dashboard';
import styled from 'styled-components';
import { useState } from 'react';
import { FloatingButton } from '../styles/shared/Button.styles';
import { ToolBar } from '../components/toolbar/ToolBar';
import { FaPen, FaPlus } from 'react-icons/fa';
import { Spacer } from '../styles/shared/BaseLayout';
import { useActions } from '../context/ActionsContext';

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgPure};
`;

export const DashboardPage = () => {
  const { isInputVisible, setIsInputVisible } = useActions();

  return (  
    <>
      {!isInputVisible ? (
        <FloatingButton onClick={() => setIsInputVisible(true)}>
          <FaPen size={16} color='white' />
        </FloatingButton>
      ) : (
        null
      )}
      <PageLayout>
        <ToolBar />
        <MainContent>
          <Dashboard />
        </MainContent>
        <SideBar/>
      </PageLayout>
    </>
  );
};