import { SideBar } from '../components/sidebar/SideBar';
import { Dashboard } from '../components/dashboard/Dashboard';
import styled from 'styled-components';

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  width: 75%;
  height: 100vh;
  overflow-y: auto;
`;

export const DashboardPage = () => {
  return (
    <PageLayout>
      <SideBar/>
      <MainContent>
        <Dashboard />
      </MainContent>
    </PageLayout>
  );
};