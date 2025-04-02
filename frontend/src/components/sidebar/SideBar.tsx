import { useEffect, useState } from 'react';
import { 
  TextBarForm, 
  TextInput,
  SummaryContainer,
  BulletIcon,
  BulletItem,
  BulletList,
  EventsContainer,
} from './SideBar.Styles';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { Notification } from '../notif/Notification';
import { useActions } from '../../context/ActionsContext';
import { PrimaryButton } from '../../styles/shared/Button.styles';
import { ResizableSidebar } from '../resize/Resize';
import { CountdownTimer } from '../sidebar/CountdownTimer';
import { FaLightbulb, FaRegCalendarCheck, FaThumbtack } from 'react-icons/fa';
import { Divider } from './SideBar.Styles';
export const SideBar = () => {
  const [text, setText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const { user } = useAuth();
  const { setNotificationMessage, setShowNotification, getLastSnapshot, updateTasks, updateEvents, isLoading, notificationMessage, showNotification, bulletPoints, calendarEvents, tasks} = useActions();

  useEffect(() => {
    getLastSnapshot();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {  
      setNoteLoading(true);
      // Create note object
      const note: Note = {
        content: text.trim(),
        user_id: user?.id || '',
        category: "Unsorted",
        cluster: -1,
      };
  
      // Insert note into database
      const notificationMessage = await NoteService.addNote(note);

      if (notificationMessage === "Calendar task created") {
        updateTasks();
      } else if (notificationMessage === "Calendar event created") {
        updateEvents();
      }
  
      // Show notification after successful note creation
      setNotificationMessage(notificationMessage);
      setShowNotification(true);
  
      console.log("Note added:", note);
      setText(""); // Clear text input after successful insert
      setNoteLoading(false);
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
    }
  }; 

  return (
    <>
      <ResizableSidebar>
        <TextBarForm onSubmit={handleSubmit}>
          <h2>Capture a thought</h2>
          <TextInput
            as="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            disabled={isLoading}
            rows={1}
          />
          <PrimaryButton width="100%" type="submit" disabled={isLoading || noteLoading}>
            {noteLoading ? "Creating..." : "Create Note"}
          </PrimaryButton>
        </TextBarForm>
        <h2>My Calendar</h2>
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
              <Divider />
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
          </BulletList>
        </EventsContainer>
        <h2>My Summary</h2>
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


