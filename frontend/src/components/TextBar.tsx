import { useState } from 'react';
import { 
  TextBarContainer, 
  TextBarForm, 
  TextInput, 
} from '../styles/components/dashboard/TextBar.styles';
import { addNote } from '../api/noteMethods';
import { useAuth } from '../context/AuthContext';
import { Note } from '../models/noteModel';
import { supabase } from '../api/supabaseClient';

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
        user_id: userData.id,  // Use the correct user ID
        category: "",
        cluster: -1,
      };
  
      // Insert note into database
      const { error: insertError } = await addNote(note);
  
      if (insertError) {
        console.error("Failed to insert note:", insertError);
        return;
      }
  
      console.log("Note added:", note);
      setText(""); // Clear text input after successful insert
  
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
    }
  };  
  
  return (
    <TextBarContainer>
      <TextBarForm onSubmit={handleSubmit}>
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
        />
      </TextBarForm>
    </TextBarContainer>
  );
}; 

