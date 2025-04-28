// components/sidebar/SidebarContent.tsx
import { useActions } from '../../context/ActionsContext';
import { Spacer } from '../../styles/shared/BaseLayout';
import { SidebarContainer } from './SideBar.Styles';
import { TasksRow } from '../calendar/TasksRow'; 
import { Snapshot } from '../calendar/Snapshot';
import { useSummary } from '../../context/SummaryProvider';
// Using window.matchMedia instead of react-responsive
export const SideBar = () => {
  const { isInputVisible } = useActions();
  const { isSummaryVisible } = useSummary();

  return (
    <SidebarContainer isInputVisible={isInputVisible}>
      <Spacer height="xl" />
      {isSummaryVisible ? <Snapshot /> : <TasksRow />}
    </SidebarContainer> 
  );
};          
