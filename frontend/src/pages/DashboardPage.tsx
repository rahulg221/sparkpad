import { TextBar } from '../components/textbar/TextBar';
import { Dashboard } from '../components/dashboard/Dashboard';

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
        placeholder="Jot down your thoughts, ideas, reminders, and more..."
      />
    </div>
  );
};