// components/sidebar/SidebarContent.tsx
import React, { useEffect, useState } from 'react';
import { NoteInput } from './components/NoteInput';
import { useActions } from '../../context/ActionsContext';
import { NoteService } from '../../api/noteService';
import { Note } from '../../models/noteModel';
import { useAuth } from '../../context/AuthProvider';
import { Row } from '../../styles/shared/BaseLayout';
import { FaGear, FaNoteSticky, FaThumbtack, FaTimeline, FaPen } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { Icon } from './_styles';

export const SidebarContent = () => {
  const {isLoading, setNotificationMessage, setShowNotification, updateTasks, updateEvents, getLastSnapshot} = useActions();
  const [text, setText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    getLastSnapshot();
  }, []);

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
      <Row main="start" cross="center" gap="sm">
        <Icon>
          <FaPen size={12}/>
        </Icon>
        <h2>New Spark</h2>
      </Row>
      <NoteInput
        text={text}
        isLoading={isLoading}
        noteLoading={noteLoading}
        setText={setText}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
