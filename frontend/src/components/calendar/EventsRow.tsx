import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Column, Row, ScrollView } from '../../styles/shared/BaseLayout';
import { Container } from '../../styles/shared/BaseLayout';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { IconButton } from '../../styles/shared/Button.styles';
import { FaTimes } from 'react-icons/fa';
import { CountdownTimer } from './CountdownTimer';
import { useActions } from '../../context/ActionsContext';
import { EventContainer } from './Calendar.Styles';

export const EventsRow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setIsEventsVisible, updateEvents, calendarEvents } = useActions();

  useEffect(() => {
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

    fetchEvents();
  }, []);

  return (
    <>            
        <ScrollView direction='horizontal'>
          <Row main="spaceBetween" cross="start">
              <h1>Events</h1>
              <IconButton onClick={() => setIsEventsVisible(false)}>
                  <FaTimes size={14} />
              </IconButton>
          </Row>
          <EventContainer>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Row main="start" cross="start" gap="md">
                {calendarEvents.map(event => (
                  <CountdownTimer eventString={event} />
                ))}
              </Row>
            )}
          </EventContainer>
        </ScrollView>
    </>
  );
};
