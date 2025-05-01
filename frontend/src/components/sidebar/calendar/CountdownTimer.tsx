import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useTheme } from 'styled-components';
import { Row, Spacer } from '../../../styles/shared/BaseLayout';
import { EventCard, CardPreview, DateContainer } from './Calendar.Styles';

export const CountdownTimer = ({ eventString }: { eventString: string }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState('');
  const [dayLabel, setDayLabel] = useState('');           
  const [start_time, eventInfo] = eventString.split('#');

  const targetTime = new Date(start_time).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(start_time);

      const difference = target.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      if (difference <= 0) {
        setTimeLeft(`00:00`);
        return;
      }

      // Check if the event is today or tomorrow
      const isToday = now.toDateString() === target.toDateString();
      const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === target.toDateString();

      if (isToday) {
        setDayLabel('');
      } else if (isTomorrow) {
        setDayLabel('Tomorrow');
      } else {
        setDayLabel(new Date(start_time).toLocaleString('en-US', {
          weekday: 'long',
        }));
      }

      if (days > 0) {
        setTimeLeft(`${days.toString()}d ${hours.toString()}h ${minutes.toString()}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours.toString()}h ${minutes.toString()}m`);
      } else {
        setTimeLeft(`${minutes.toString()}m ${seconds.toString()}s`);
      }
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [start_time]);

  return (
    <EventCard>
      <CardPreview>
        {eventInfo}
      </CardPreview>
      <Row main="start" cross="center" gap="md">
          <DateContainer>
            {new Date(start_time).toLocaleDateString('en-US', {
              weekday: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </DateContainer>
          <Spacer expand={true} />
          <FaClock size={14} color={theme.colors.eventColor} />
      </Row>
    </EventCard>
  );
};
