import { TextBar } from '../components/TextBar';
import { Dashboard } from '../components/Dashboard';

export const DashboardPage = () => {
  const handleSubmit = (text: string) => {
    // Handle the text submission
    console.log('Submitted:', text);
  };

  return (
    <div>
      <Dashboard />
      <TextBar 
        onSubmit={handleSubmit}
        placeholder="Type your message..."
      />
    </div>
  );
};