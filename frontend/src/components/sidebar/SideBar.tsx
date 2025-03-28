import { useState } from 'react';
import { 
  SideBarContainer,
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
import { supabase } from '../../api/supabaseClient';
import { Notification } from '../notif/Notification';
import { useActions } from '../../context/ActionsContext';
import {  MdLightbulb } from 'react-icons/md';
import { PrimaryButton } from '../../styles/shared/Button.styles';

export const SideBar = () => {
  const [text, setText] = useState('');
  const { user } = useAuth();
  const { setNotificationMessage, setShowNotification, isLoading, notificationMessage, showNotification, summary, bulletPoints } = useActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fetch the full user data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user?.id)
        .single();

      if (userError || !userData) {
        console.error("Failed to get user ID:", userError);
        return;
      }
  
      if (!text.trim()) {
        console.warn("Cannot submit empty note.");
        return;
      }
  
      // Create note object
      const note: Note = {
        content: text.trim(),
        user_id: userData.id,
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

  const getDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <SideBarContainer>
        <h2>Snapshot</h2>
        { summary ? 
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
        : 
        <p>Use Snapshot to view a condensed summary of your notes.</p>
        }
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
      </SideBarContainer>
      {showNotification && (
        <Notification 
          message={notificationMessage} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </>
  );
}; 


