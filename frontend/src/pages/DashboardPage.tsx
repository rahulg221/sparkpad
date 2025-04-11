import { SideBar } from '../components/sidebar/SideBar';
import { Dashboard } from '../components/dashboard/Dashboard';
import styled from 'styled-components';
import { useState } from 'react';
import { FloatingButton } from '../styles/shared/Button.styles';
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';

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
  const [isOpen, setIsOpen] = useState(true);

  return (  
    <>
      <FloatingButton onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? '-' : '+'}
      </FloatingButton>
      <PageLayout>
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        <MainContent>
          <Dashboard />
        </MainContent>
      </PageLayout>
    </>
  );
};