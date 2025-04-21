import { NotificationContainer } from './Notif.Styles';

interface NotificationProps {
    message: string;
    type: string;
    onClose: () => void;
  }
  
export const Notification = ({ message, type, onClose }: NotificationProps) => {
  setTimeout(onClose, 3000); // Auto close after 3 seconds

  return (
    <NotificationContainer type={type}>
      {message}
    </NotificationContainer>
  );
};