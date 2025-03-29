import { useEffect, useState } from 'react';
import { 
  TextBarForm, 
  TextInput,
  SummaryContainer,
  BulletIcon,
  BulletItem,
  BulletList,
} from './SideBar.Styles';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { Notification } from '../notif/Notification';
import { useActions } from '../../context/ActionsContext';
import {  MdLightbulb } from 'react-icons/md';
import { PrimaryButton } from '../../styles/shared/Button.styles';
import { ResizableSidebar } from '../resize/Resize';

export const SideBar = () => {
  const [text, setText] = useState('');
  const { user } = useAuth();
  const { setNotificationMessage, setShowNotification, getLastSummary, isLoading, notificationMessage, showNotification, bulletPoints } = useActions();

  useEffect(() => {
    getLastSummary();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {  
      // Create note object
      const note: Note = {
        content: text.trim(),
        user_id: user?.id || '',
        category: "Unsorted",
        cluster: -1,
      };
  
      // Insert note into database
      const notificationMessage = await NoteService.addNote(note);
  
      // Show notification after successful note creation
      setNotificationMessage(notificationMessage);
      setShowNotification(true);
  
      console.log("Note added:", note);
      setText(""); // Clear text input after successful insert
  
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
    }
  }; 

  return (
    <>
      <ResizableSidebar>
        <h2>Snapshot</h2>
        <SummaryContainer>
        <BulletList>
          {bulletPoints.map((bulletPoint, index) => (
            <BulletItem key={index}>
              <BulletIcon>
                <MdLightbulb size={20} />
              </BulletIcon>
              <span>{bulletPoint}</span>
            </BulletItem>
          ))}
        </BulletList>
      </SummaryContainer> 
      <TextBarForm onSubmit={handleSubmit}>
        <h2>New Note</h2>
        <TextInput
          as="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Capture an idea, task, or reminder...'
          disabled={isLoading}
          rows={1}
        />
        <PrimaryButton width="100%" type="submit" disabled={isLoading}>Create Note</PrimaryButton>
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


