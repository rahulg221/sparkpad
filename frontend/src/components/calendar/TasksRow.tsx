import { useEffect, useState } from 'react';
import { Column, Row, ScrollView, Container, Spacer } from '../../styles/shared/BaseLayout';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { useTheme } from 'styled-components';
import { useActions } from '../../context/ActionsContext';
import { CardPreview, SmallTextButton, EventCard, ItemContainer, TaskCard, SummaryContainer  } from './Calendar.Styles';
import { FaThumbtack, FaFireFlameCurved, FaClock, FaPen } from 'react-icons/fa6';
import { CountdownTimer } from './CountdownTimer';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthProvider';
import { useNotes } from '../../context/NotesProvider';
import { Note } from '../../models/noteModel';
import ReactMarkdown from 'react-markdown';
import { Snapshot } from './Snapshot';
import { IconButton, TextButton } from '../../styles/shared/Button.styles';
import { FaTimes } from 'react-icons/fa';

export const TasksRow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setIsTasksVisible, updateTasks, tasks, updateEvents, calendarEvents, isInputVisible, setIsInputVisible } = useActions();
  const { isGoogleConnected } = useAuth();
  const theme = useTheme();
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    if (isInputVisible) {
      fetchTasks();
      fetchEvents();
    }
  }, [isInputVisible]);

  const fetchTasks = async () => {
    setIsLoading(true);

    try {
      await updateTasks();
    } catch (err) {
      console.error('Error fetching recent notes:', err);
    } finally {
      setIsLoading(false);
    }   
  };

  const fetchEvents = async () => {
    setIsLoading(true);

    try {
      await updateEvents();
    } catch (err) {
      console.error('Error fetching recent notes:', err);
    } finally {
      setIsLoading(false);
    }   
  };

  return (
      <Column main="start" cross="start" gap="lg">
        <Container width="100%">
          <Row main="spaceBetween" cross="start">
            <h2 style={{ fontWeight: 'bold' }}>Tasks</h2>
            <IconButton onClick={() => setIsInputVisible(false)}>
              <FaTimes size={14}/>
            </IconButton>
          </Row>
          <Spacer height="sm" />
          <ItemContainer>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              isGoogleConnected ? (
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
              <h2>Connect your Google Calendar in Settings to see your tasks</h2>
            )
        )}  
      </ItemContainer>
      </Container>
      <Container width="100%">
        <h2 style={{ fontWeight: 'bold' }}>Events</h2>
        <Spacer height="sm" />
        <ItemContainer>
          {isLoading ? (
            <LoadingSpinner />
          ) : isGoogleConnected ? (
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
            <h2>Connect your Google Calendar in Settings to see your events</h2>
          )}  
        </ItemContainer>
      </Container>
      </Column>
  );
};
