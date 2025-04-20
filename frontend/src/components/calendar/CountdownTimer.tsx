import { useState, useEffect } from 'react';
import { Item, Icon, Circle } from '../sidebar/SideBar.Styles';
import { ItemCard } from '../../styles/shared/Notes.styles';
import { Column, Row } from '../../styles/shared/BaseLayout';
import { FaCalendar, FaClock, FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Card, CardInfo, CardPreview } from './Calendar.Styles';
import { NoteInfo } from '../notesrow/NotesRow.Styles';
import { NotePreview } from '../notesrow/NotesRow.Styles';
import { SmallIconButton } from '../noteslist/NotesList.Styles';
import { useTheme } from 'styled-components';

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
    <Card type="event">
      <CardPreview type="event">
          <ReactMarkdown>
            {eventInfo}
          </ReactMarkdown>
      </CardPreview>
      <CardInfo>
          {new Date(start_time).toLocaleDateString('en-US', {
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          })}
          <FaClock size={14} color={theme.colors.eventColor} />
      </CardInfo>
    </Card>
  );
};
