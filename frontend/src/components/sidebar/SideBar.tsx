// components/sidebar/SidebarContent.tsx
import React, { useEffect, useState } from 'react';
import { useActions } from '../../context/ActionsContext';
import { NoteService } from '../../api/noteService';
import { Note } from '../../models/noteModel';
import { useAuth } from '../../context/AuthProvider';
import { Row, Spacer } from '../../styles/shared/BaseLayout';
import { FaClock, FaPen } from 'react-icons/fa6';
import { Icon, SidebarContainer, TextBarForm, TextInput, DateHint } from './SideBar.Styles';
import { FaTimes } from 'react-icons/fa';
import { IconButton, PrimaryButton } from '../../styles/shared/Button.styles';
import { useNotes } from '../../context/NotesProvider';
import { parseDate } from 'chrono-node';

// Using window.matchMedia instead of react-responsive
export const SideBar = () => {
  const {isLoading, setNotificationMessage, setShowNotification, updateTasks, updateEvents } = useActions();
  const [text, setText] = useState('');
  const { currentCategory, writeInCurrentCategory, refreshNotes, setRefreshNotes } = useNotes();
  // Fix this? Not sure if this is meant to be from a provider
  const [noteLoading, setNoteLoading] = useState(false);
  const { isInputVisible, setIsInputVisible } = useActions();
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const [parsedDateHint, setParsedDateHint] = useState<string | null>(null);
  const { user } = useAuth();
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setText(input);
  
    // Clear all date info if the text was deleted
    if (input.trim() === '') {
      setParsedDate(null);
      setParsedDateHint('');
      return;
    }
  
    // Only parse if it starts with /e
    if (input.startsWith('/e')) {
      const parsedDate = parseDate(input);
      
      if (parsedDate) {
        setParsedDate(parsedDate);
  
        const parsedDateHint = parsedDate.toLocaleString('en-US', {
          month: 'short',
          weekday: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
  
        setParsedDateHint(parsedDateHint);
      } else {
        setParsedDate(null);
        setParsedDateHint('');
      }
    } else {
      // If not /e command, also clear date preview
      setParsedDate(null);
      setParsedDateHint('');
    }
  };
  
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

      if (isMobile) {
        setIsInputVisible(false);
      }

      // Refresh notes when new note is added, listening for the refreshNotes state on NotesList
      if (!refreshNotes) {
        setRefreshNotes(true);
      } else {
        setRefreshNotes(false);
      }
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
      <TextBarForm title="Type / to see commands" onSubmit={handleSubmit}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <TextInput
            as="textarea"
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && text.trim() !== "") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={
              writeInCurrentCategory
                ? 'Writing in ' + currentCategory + '...'
                : 'Write to the void...'
            }
            disabled={isLoading}
            rows={1}
            style={{ paddingBottom: parsedDateHint ? '2.2em' : undefined }}
          />
          {!parsedDateHint && text[0] === '/' && (
            <DateHint>
              -- Commands --
              <br />
              /e Add to calendar
              <br />
              /t Add to tasks
            </DateHint>
          )}
          {parsedDateHint && (
            <DateHint>
              <FaClock size={14} />
              {parsedDateHint}
            </DateHint>
          )}
        </div>
        <Spacer height='sm' />
        <PrimaryButton type="submit" disabled={isLoading || noteLoading}>
          {noteLoading ? 'Capturing...' : 'Capture Spark'}
        </PrimaryButton>
      </TextBarForm>
    </SidebarContainer> 
  );
};          
