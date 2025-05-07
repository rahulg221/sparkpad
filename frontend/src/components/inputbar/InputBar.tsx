import { useNotes } from "../../context/NotesProvider";
import { useState, useRef, useEffect } from "react";
import { extractDateAndText } from "../../utils/dateParse";
import { NoteService } from "../../api/noteService";
import { UserService } from "../../api/userService";
import { Note } from "../../models/noteModel";
import { useAuth } from "../../context/AuthProvider";
import { useActions } from "../../context/ActionsContext";
import { useTheme } from "styled-components";
import { NewStickyNoteModal } from "./NewStickyNoteModal";

export const InputBar = () => {
  const {
    setCategories,
    setNotificationMessage,
    setShowNotification,
    updateTasks,
    updateEvents,
    setNotificationType,
    setIsSidebarVisible,
    isInputBarVisible,
    isToolBarCollapsed,
    setIsInputBarVisible,
  } = useActions(); // 
  
  const [text, setText] = useState('');
  const { currentCategory, writeInCurrentCategory, refreshNotes, setRefreshNotes } = useNotes();
  const [noteLoading, setNoteLoading] = useState(false); 
  const [parsedDateHint, setParsedDateHint] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { user, lockedCategories } = useAuth();
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (isInputBarVisible && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isInputBarVisible]);

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setText(input);

    if (input.trim() === '') {
      setParsedDateHint('');
      return;
    }

    if (input.startsWith('/e')) {
      const { hint } = await extractDateAndText(input);
      setParsedDateHint(hint);
    } else {
      setParsedDateHint('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;

    let notificationMessage = '';
    
    try {
      setNoteLoading(true);
      setNotificationMessage('Capturing spark...');
      setShowNotification(true);
      setNotificationType('note');

      if (text.startsWith('/e')) {
        const { dateTimeString, content } = await extractDateAndText(text);

        const note: Note = {
          content: text.trim(),
          user_id: user?.id || '',
          category: writeInCurrentCategory ? currentCategory : 'Unsorted',
          cluster: -1,
        };

        notificationMessage = await NoteService.addNote(note, dateTimeString, content, user?.isGoogleConnected);
        setNotificationType('event');
        setNotificationMessage(notificationMessage);
        setShowNotification(true);
        setParsedDateHint('');
      } 
      else {
        if (text.startsWith('/t')) {
          setNotificationType('task');
        } else {
          setNotificationType('note');
        }

        const note: Note = {
          content: text.trim(),
          user_id: user?.id || '',
          category: 'Unsorted',
          cluster: -1,
        };

        notificationMessage = await NoteService.addNote(note);
        setParsedDateHint('');
      }

      if (notificationMessage.includes('Task')) {
        updateTasks(true);
      } else if (notificationMessage.includes('Calendar')) {
        updateEvents(true);
      }

      //setNotificationMessage(notificationMessage);
      //setShowNotification(true);
      setText('');

      if (isMobile) {
        setIsSidebarVisible(false);
      }

      setRefreshNotes(!refreshNotes); // toggle it
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
      setIsInputBarVisible(false);
    }
  };

  return (
      <NewStickyNoteModal
        isOpen={isInputBarVisible}
        onClose={() => setIsInputBarVisible(false)}
        onSave={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
        title="New Note"
        dateHint={parsedDateHint || ''}
      >
        <textarea
          ref={textInputRef}
          value={text}
          onChange={(e) => handleTextChange(e)}
          placeholder="Write your note here..."
          onKeyDown={handleKeyDown}  
          maxLength={1000}
          style={{
            width: '100%',
            height: '200px',
            padding: theme.spacing.lg,
            backgroundColor: 'transparent',
            borderRadius: theme.borderRadius.md,
            outline: 'none',
            border: 'none',
            color: theme.colors.textPrimary,
            resize: 'vertical',
            overflow: 'auto',
            fontFamily: 'inherit',
          }}
        />
      </NewStickyNoteModal>
    );    
};
