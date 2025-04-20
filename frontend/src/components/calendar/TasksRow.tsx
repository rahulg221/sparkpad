import { useEffect, useState } from 'react';
import { Row, ScrollView, Spacer } from '../../styles/shared/BaseLayout';
import { Container } from '../../styles/shared/BaseLayout';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { IconButton } from '../../styles/shared/Button.styles';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from 'styled-components';
import { useActions } from '../../context/ActionsContext';
import { Card, CardPreview, CardInfo } from './EventsRow.Styles';
import ReactMarkdown from 'react-markdown';
import { FaThumbtack } from 'react-icons/fa6';

export const TasksRow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setIsTasksVisible, updateTasks, tasks } = useActions();
  const theme = useTheme();
  useEffect(() => {
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
                      <Card type="task">
                        <CardPreview>
                            <ReactMarkdown>
                                {task}
                            </ReactMarkdown>
                        </CardPreview>
                        <CardInfo>
                            <Spacer expand={true} />
                            <FaThumbtack size={14} color={theme.colors.taskColor} />       
                        </CardInfo>
                      </Card>
                    ))}
                  </Row>
            )}  
          </Container>
        </ScrollView>
    </>
  );
};
