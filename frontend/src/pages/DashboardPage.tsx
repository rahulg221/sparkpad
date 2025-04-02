import { SideBar } from '../components/sidebar/SideBar';
import { Dashboard } from '../components/dashboard/Dashboard';
import styled from 'styled-components';

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

export const DashboardPage = () => {
  return (
    <PageLayout>
      <SideBar/>
      <Dashboard />
    </PageLayout>
  );
};