import { useState, useEffect } from 'react';
import { Item, Icon, Circle } from '../_styles';
import { ItemCard } from '../../../styles/shared/Notes.styles';
import { Column, Row } from '../../../styles/shared/BaseLayout';
import { FaCalendar, FaClock } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
export const CountdownTimer = ({ eventString }: { eventString: string }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [dayLabel, setDayLabel] = useState('');           
  const [start_time, summary] = eventString.split('#');

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
    <ItemCard>
      <Row main='spaceBetween' cross='center'>
        <Item className='inline'>
          <span className='content'>{summary}</span>
        </Item>
        <Item className='inline'>
          <Column main='end' cross='center'>
              <span className='timer'>{targetTime}</span>
              <span className='timer'>{dayLabel}</span>
          </Column>
          <Icon>
            <FaClock size={12}/>
          </Icon>
        </Item>
      </Row>
    </ItemCard>
  );
};
