import { useState, useEffect } from 'react';

export const CountdownTimer = ({ eventString }: { eventString: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  const [start_time, summary] = eventString.split('#');

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
        setTimeLeft(`In Progress - ${-1*hours}h ${-1*minutes}m ago`);
        return;
      }

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerId);
  }, [start_time]);

  return (
    <span>
      [{timeLeft}] {summary}
    </span>
  );
};
