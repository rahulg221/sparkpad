import { useState } from 'react';
import { 
  SideBarContainer,
  TextBarForm, 
  TextInput,
} from './SideBar.Styles';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { supabase } from '../../api/supabaseClient';
import { Notification } from '../notif/Notification';
import { PrimaryButton } from '../../styles/shared/Button.styles';

interface SideBarProps {
  placeholder?: string;
  isLoading?: boolean;
}

export const SideBar = ({ 
  placeholder = 'Brainstorm, create lists, reflect, and turn your chaos into clarity.', 
  isLoading = false 
}: SideBarProps) => {
  const [text, setText] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { user } = useAuth();

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
  
  return (
    <>
      <SideBarContainer>
        <h1>AI Thought Organizer</h1>
        <TextBarForm onSubmit={handleSubmit}>
          <TextInput
            as="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
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


