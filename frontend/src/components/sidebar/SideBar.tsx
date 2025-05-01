// components/sidebar/SidebarContent.tsx
import { useActions } from '../../context/ActionsContext';
import { Spacer } from '../../styles/shared/BaseLayout';
import { SidebarContainer } from './SideBar.Styles';
import { TasksRow } from './calendar/CalendarView'; 
import { Snapshot } from './calendar/Snapshot';
import { useSummary } from '../../context/SummaryProvider';
// Using window.matchMedia instead of react-responsive
export const SideBar = () => {
  const { isSidebarVisible } = useActions();
  const { isSummaryVisible } = useSummary();

  return (
    <SidebarContainer isSidebarVisible={isSidebarVisible}>
      <Spacer height="lg" />
      {isSummaryVisible ? <Snapshot /> : <TasksRow />}
    </SidebarContainer> 
  );
};          
