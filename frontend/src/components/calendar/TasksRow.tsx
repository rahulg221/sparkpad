import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Row, ScrollView } from '../../styles/shared/BaseLayout';
import { Container } from '../../styles/shared/BaseLayout';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { IconButton } from '../../styles/shared/Button.styles';
import { FaTimes, FaThumbsUp } from 'react-icons/fa';
import { CountdownTimer } from './CountdownTimer';
import { useActions } from '../../context/ActionsContext';
import { EventPreview, EventCard, EventInfo } from './EventsRow.Styles';
import ReactMarkdown from 'react-markdown';
import { SmallIconButton } from '../noteslist/NotesList.Styles';
import { FaThumbtack } from 'react-icons/fa6';

export const TasksRow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setIsTasksVisible, updateTasks, tasks } = useActions();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);

      try {
        updateTasks();
      } catch (err) {
        console.error('Error fetching recent notes:', err);
      } finally {
        setIsLoading(false);
      }   
    };

    fetchTasks();
  }, []);

  return (
    <>            
        <Row main="spaceBetween" cross="start">
            <h1>Upcoming Tasks</h1>
            <IconButton onClick={() => setIsTasksVisible(false)}>
                <FaTimes size={14} />
            </IconButton>
        </Row>
          <ScrollView direction='horizontal'>
              <Container width="100%">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Row main="start" cross="start" gap="md">
                    {tasks.map(task => (
                      <EventCard>
                        <EventPreview>
                            <ReactMarkdown>
                                {task}
                            </ReactMarkdown>
                        </EventPreview>
                        <EventInfo>
                            <SmallIconButton onClick={() => {}}>
                                <FaThumbtack size={14} />
                            </SmallIconButton>
                        </EventInfo>
                      </EventCard>
                    ))}
                  </Row>
            )}  
          </Container>
        </ScrollView>
    </>
  );
};
