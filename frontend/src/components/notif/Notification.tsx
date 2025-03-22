import { NotificationContainer } from './Notif.Styles';

interface NotificationProps {
    message: string;
    onClose: () => void;
  }
  
  export const Notification = ({ message, onClose }: NotificationProps) => {
    setTimeout(onClose, 3000); // Auto close after 3 seconds
  
    return (
      <NotificationContainer>
        {message}
      </NotificationContainer>
    );
  };