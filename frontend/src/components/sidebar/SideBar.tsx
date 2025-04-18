// components/sidebar/SidebarContent.tsx
import React, { useEffect, useState } from 'react';
import { NoteInput } from './components/NoteInput';
import { useActions } from '../../context/ActionsContext';
import { NoteService } from '../../api/noteService';
import { Note } from '../../models/noteModel';
import { useAuth } from '../../context/AuthProvider';
import { Row, Spacer } from '../../styles/shared/BaseLayout';
import { FaPen } from 'react-icons/fa6';
import { Icon, SidebarContainer } from './SideBar.Styles';
import { FaTimes } from 'react-icons/fa';
import { IconButton } from '../../styles/shared/Button.styles';
import { useNotes } from '../../context/NotesProvider';

export const SideBar = () => {
  const {isLoading, setNotificationMessage, setShowNotification, updateTasks, updateEvents } = useActions();
  const [text, setText] = useState('');
  const { currentCategory, writeInCurrentCategory } = useNotes();
  // Fix this? Not sure if this is meant to be from a provider
  const [noteLoading, setNoteLoading] = useState(false);
  const { isInputVisible, setIsInputVisible } = useActions();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setNoteLoading(true);

      const note: Note = {
        content: text.trim(),
        user_id: user?.id || '',
        category: writeInCurrentCategory ? currentCategory : 'Unsorted',
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
    <SidebarContainer isInputVisible={isInputVisible}>
      <Row main="start" cross="center" gap="sm">
        <Icon>
          <FaPen size={14}/>
        </Icon>
        <h2>New Spark</h2>
        <Spacer expand={true} />
        <IconButton onClick={() => setIsInputVisible(false)}>
          <FaTimes size={14}/>
        </IconButton>
      </Row>
      <NoteInput
        text={text}
        isLoading={isLoading}
        noteLoading={noteLoading}
        writeInCurrentCategory={writeInCurrentCategory}
        currentCategory={currentCategory}
        setText={setText}
        handleSubmit={handleSubmit}
      />
    </SidebarContainer>
  );
};
