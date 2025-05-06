import { useEffect, useState } from 'react';
import { Column, Row, ScrollView, Container, Spacer } from '../../../styles/shared/BaseLayout';
import { LoadingSpinner } from '../../../styles/shared/LoadingSpinner';
import { useTheme } from 'styled-components';
import { useActions } from '../../../context/ActionsContext';
import { CardPreview, SmallTextButton, EventCard, ItemContainer, TaskCard, SummaryContainer  } from './Calendar.Styles';
import { FaThumbtack, FaFireFlameCurved, FaClock, FaPen } from 'react-icons/fa6';
import { CountdownTimer } from './CountdownTimer';
import { NoteService } from '../../../api/noteService';
import { useAuth } from '../../../context/AuthProvider';
import { useNotes } from '../../../context/NotesProvider';
import { Note } from '../../../models/noteModel';
import ReactMarkdown from 'react-markdown';
import { Snapshot } from './Snapshot';
import { IconButton, TextButton } from '../../../styles/shared/Button.styles';
import { FaTimes } from 'react-icons/fa';

export const TasksRow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setIsTasksVisible, updateTasks, tasks, updateEvents, calendarEvents, isSidebarVisible, setIsSidebarVisible } = useActions();
  const { user } = useAuth();
  const theme = useTheme();
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    if (isSidebarVisible) {
      fetchTasks();
      fetchEvents();
    }
  }, [isSidebarVisible]);

  const fetchTasks = async () => {
    setIsLoading(true);

    try {
      await updateTasks(false);
    } catch (err) {
      console.error('Error fetching recent notes:', err);
    } finally {
      setIsLoading(false);
    }   
  };

  const fetchEvents = async () => {
    setIsLoading(true);

    try {
      await updateEvents(false);
    } catch (err) {
      console.error('Error fetching recent notes:', err);
    } finally {
      setIsLoading(false);
    }   
  };

  return (
      <Column main="start" cross="start" gap="lg">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Container width="100%">
              <Row main="spaceBetween" cross="start">
                <h2>Tasks</h2>
            <IconButton onClick={() => setIsSidebarVisible(false)}>
              <FaTimes size={14}/>
            </IconButton>
          </Row>
          <Spacer height="md" />
          <ItemContainer>
            {
              user?.isGoogleConnected ? (
                <Column main="start" cross="start" gap="md">
                  {tasks.slice(0, showAllTasks ? tasks.length :  4).map(task => (
                    <TaskCard>
                    <Row main="spaceBetween" cross="center">
                      <CardPreview>
                        {task}
                      </CardPreview>
                      <FaThumbtack size={14} color={theme.colors.taskColor} />       
                    </Row>
                  </TaskCard>
                ))}
                {tasks.length > 3 && (
                  <SmallTextButton onClick={() => setShowAllTasks(!showAllTasks)}>
                    {showAllTasks ? 'Show less' : 'Show all tasks'}
                  </SmallTextButton>
                )}
              </Column>
            ) : (
              <p>Connect your Google Calendar in Settings to see your tasks</p>
            )}
          </ItemContainer>
        </Container>
        <Container width="100%">
        <h2>Events</h2>
        <Spacer height="md" />
        <ItemContainer>
          {user?.isGoogleConnected ? (
            <Column main="start" cross="start" gap="md">
              {calendarEvents.slice(0, showAllEvents ? calendarEvents.length : 4).map(event => (
                  <CountdownTimer eventString={event} />
              ))}
              {calendarEvents.length > 3 && (
                <SmallTextButton onClick={() => setShowAllEvents(!showAllEvents)}>
                  {showAllEvents ? 'Show less' : 'Show all events'}
                </SmallTextButton>
              )}
            </Column>
          ) : (
            <p>Connect your Google Calendar in Settings to see your events</p>
          )}  
        </ItemContainer>
      </Container>
      </>
      )}
      </Column>
  );
};
