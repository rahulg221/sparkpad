import { useEffect, useState } from 'react';
import {
  TextBarForm,
  TextInput,
  SummaryContainer,
  BulletIcon,
  BulletItem,
  BulletList,
  EventsContainer,
  Divider,
  FloatingButton,
  ScrollableContent,
  MainHeader,
  SubHeader,
} from './SideBar.Styles';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { Notification } from '../notif/Notification';
import { useActions } from '../../context/ActionsContext';
import { PrimaryButton, SecondaryButton } from '../../styles/shared/Button.styles';
import { ResizableSidebar } from '../resize/Resize';
import { CountdownTimer } from '../sidebar/CountdownTimer';
import { FaDownload, FaLightbulb, FaRegCalendarCheck, FaStar, FaThumbtack } from 'react-icons/fa';
import { MdClose, MdFlashOn, MdMenu, MdStars } from 'react-icons/md';
import { FaBoltLightning } from 'react-icons/fa6';

export const SideBar = () => {
  const [text, setText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const {
    setNotificationMessage,
    setShowNotification,
    getLastSnapshot,
    showSnapshot,
    updateTasks,
    updateEvents,
    isLoading,
    notificationMessage,
    showNotification,
    bulletPoints,
    calendarEvents,
    tasks,
  } = useActions();

  useEffect(() => {
    getLastSnapshot();
  }, []);  

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setNoteLoading(true);

      const note: Note = {
        content: text.trim(),
        user_id: user?.id || '',
        category: 'Unsorted',
        cluster: -1,
      };

      const notificationMessage = await NoteService.addNote(note);

      if (notificationMessage === 'Calendar task created') {
        updateTasks();
      } else if (notificationMessage === 'Calendar event created') {
        updateEvents();
      }

      setNotificationMessage(notificationMessage);
      setShowNotification(true);
      setText('');
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <>
      <FloatingButton onClick={() => setSidebarOpen(prev => !prev)}>
        {sidebarOpen ? '-' : '+'}
      </FloatingButton>
      <ResizableSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen}>
        <ScrollableContent>
          <MainHeader>
            <BulletIcon> 
              <FaBoltLightning size={16} />
            </BulletIcon>
            <h1>Sparkpad</h1>
          </MainHeader>
          <SubHeader>
            <h2>Tasks</h2>
          </SubHeader>
          <EventsContainer>
            <BulletList>
              {tasks.map((string, index) => (
                <BulletItem key={index}>
                  <BulletIcon>
                    <FaThumbtack size={16} />
                  </BulletIcon>
                  <span>{string}</span>
                </BulletItem>
              ))}
            </BulletList>
          </EventsContainer>
          <SubHeader>
            <h2>Events</h2>
          </SubHeader>
          <EventsContainer>
            <BulletList>
              {calendarEvents.map((event, index) => (
                <BulletItem key={index}>
                  <BulletIcon>
                    <FaRegCalendarCheck size={16} />
                  </BulletIcon>
                  <CountdownTimer eventString={event} />
                </BulletItem>
              ))}
            </BulletList>
          </EventsContainer>
          <SubHeader>
            <h2>Snapshot</h2>
          </SubHeader>
          <SummaryContainer>
            <BulletList>
              {bulletPoints.map((bulletPoint, index) => (
                <BulletItem key={index}>
                  <BulletIcon>
                    <FaLightbulb size={16} />
                  </BulletIcon>
                  <span>{bulletPoint}</span>
                </BulletItem>
              ))}
            </BulletList>
          </SummaryContainer>
        </ScrollableContent>
        <TextBarForm onSubmit={handleSubmit}>
          <TextInput
            as="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Capture the spark before it fades..."
            disabled={isLoading}
            rows={1}
          />
          <PrimaryButton type="submit" disabled={isLoading || noteLoading}>
            {noteLoading ? 'Creating...' : 'New Spark'}
          </PrimaryButton>
        </TextBarForm>
      </ResizableSidebar>
      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

