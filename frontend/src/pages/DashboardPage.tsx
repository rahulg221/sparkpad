import { SideBar } from '../components/sidebar/SideBar';
import { Dashboard } from '../components/dashboard/Dashboard';
import styled from 'styled-components';
import { useState } from 'react';
import { FloatingButton } from '../styles/shared/Button.styles';
import { ToolBar } from '../components/toolbar/ToolBar';
import { FaPen, FaPlus } from 'react-icons/fa';
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
  
`;

export const DashboardPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (  
    <>
      {!isOpen ? (
        <FloatingButton onClick={() => setIsOpen(prev => !prev)}>
          <FaPen size={16} color='black' />
        </FloatingButton>
      ) : (
        null
      )}
      <PageLayout>
        <ToolBar />
        <MainContent>
          <Dashboard />
        </MainContent>
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      </PageLayout>
    </>
  );
};