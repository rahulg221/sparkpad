import { useState, useEffect } from 'react';
import { Item, Icon, Circle } from '../_styles';
import { ItemCard } from '../../../styles/shared/Notes.styles';
import { Row } from '../../../styles/shared/BaseLayout';
import { FaCalendar } from 'react-icons/fa';

export const CountdownTimer = ({ eventString }: { eventString: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  const [start_time, summary] = eventString.split('#');

  const targetDate = new Date(start_time).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
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

      if (days > 0) {
        setTimeLeft(`${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
      } else {
        setTimeLeft(`${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
      }
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [start_time]);

  return (
    <ItemCard>
      <Row main='spaceBetween' cross='center'>
        <Item>
          <span className='content'>{summary}</span>
          <span className='timer'>{targetDate} → {timeLeft}</span>
        </Item>
      </Row>
    </ItemCard>
  );
};
