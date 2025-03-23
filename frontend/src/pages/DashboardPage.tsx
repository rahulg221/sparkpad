import { TextBar } from '../components/textbar/TextBar';
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
  width: 80%;
  height: 100vh;
  overflow-y: auto;
`;

export const DashboardPage = () => {
  const handleSubmit = (text: string) => {
    // Handle the text submission
    console.log('Submitted:', text);
  };

  return (
    <PageLayout>
      <TextBar 
        onSubmit={handleSubmit}
        placeholder="Jot down your random thoughts and ideas, create lists, and more..."
      />
      <MainContent>
        <Dashboard />
      </MainContent>
    </PageLayout>
  );
};