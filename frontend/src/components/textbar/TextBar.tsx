import { useState } from 'react';
import { 
  TextBarContainer, 
  TextBarForm, 
  TextInput, 
} from './TextBar.styles';
import { addNote } from '../../api/noteMethods';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { supabase } from '../../api/supabaseClient';
import { PrimaryButton } from '../../styles/shared/Button.styles';
import { Notification } from '../notif/Notification';

interface TextBarProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const TextBar = ({ 
  placeholder = 'Type a message...', 
  isLoading = false 
}: TextBarProps) => {
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
      const notificationMessage = await addNote(note);
  
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
      <TextBarContainer>
        <TextBarForm onSubmit={handleSubmit}>
          <TextInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
          />
          <PrimaryButton type="submit" disabled={isLoading}>Create Note</PrimaryButton>
        </TextBarForm>
      </TextBarContainer>
      {showNotification && (
        <Notification 
          message={notificationMessage} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </>
  );
}; 


