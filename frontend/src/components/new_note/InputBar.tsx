import { useNotes } from "../../context/NotesProvider";
    import { TextInput, TextBarForm, DateHint, SubmitButton, InputBarContainer } from "./InputBar.Styles";
import { FaClock, FaArrowUp } from "react-icons/fa"; 
import { useState } from "react";
import { extractDateAndText } from "../../utils/dateParse";
import { NoteService } from "../../api/noteService";
import { UserService } from "../../api/userService";
import { Note } from "../../models/noteModel";
import { useAuth } from "../../context/AuthProvider";
import { useActions } from "../../context/ActionsContext";
import { LoadingSpinner } from "../../styles/shared/LoadingSpinner";
import { IoSparkles } from "react-icons/io5";
import { Row, Stack } from "../../styles/shared/BaseLayout";
import { FaSpinner, FaSquare } from "react-icons/fa6";

export const InputBar = () => {
  const {
    isLoading,
    setCategories,
    setNotificationMessage,
    setShowNotification,
    updateTasks,
    updateEvents,
    setNotificationType,
    isInputVisible,
    setIsInputVisible,
  } = useActions(); // <- ✅ only call once
  
  const [text, setText] = useState('');
  const { currentCategory, writeInCurrentCategory, refreshNotes, setRefreshNotes } = useNotes();
  const [noteLoading, setNoteLoading] = useState(false); // ✅ fine to be local
  const [parsedDateHint, setParsedDateHint] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useAuth();
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

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
    let categories: string[] = [];

    try {
      setNoteLoading(true);

      if (text.startsWith('/c')) {
        const category = text.substring(2).trim(); 

        const anchorNote: Note = {
          content: 'Custom Sparkpad created!\n- This sparkpad is locked by default, click the lock icon to unlock it.\n- Click the pen icon to write in this sparkpad.',
          user_id: user?.id || '',
          category,
          cluster: -1,
        };

        await NoteService.addNote(anchorNote);
        await UserService.updateLockedCategory(user?.id || '', category);

        notificationMessage = 'Custom sparkpad created!';
        categories = await NoteService.getDistinctCategories(user?.id || '');

        setNotificationMessage(notificationMessage);
        setShowNotification(true);
        setCategories(categories);
      } 
      else if (text.startsWith('/e')) {
        const { dateTimeString, content } = await extractDateAndText(text);

        const note: Note = {
          content: text.trim(),
          user_id: user?.id || '',
          category: writeInCurrentCategory ? currentCategory : 'Unsorted',
          cluster: -1,
        };

        notificationMessage = await NoteService.addNote(note, dateTimeString, content);
        setNotificationType('event');
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
          category: writeInCurrentCategory ? currentCategory : 'Unsorted',
          cluster: -1,
        };

        notificationMessage = await NoteService.addNote(note);
        setParsedDateHint('');
      }

      if (notificationMessage.includes('Task')) {
        updateTasks();
      } else if (notificationMessage.includes('Calendar')) {
        updateEvents();
      }

      setNotificationMessage(notificationMessage);
      setShowNotification(true);
      setText('');

      if (isMobile) {
        setIsInputVisible(false);
      }

      setRefreshNotes(!refreshNotes); // toggle it

    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <TextBarForm onSubmit={handleSubmit}>
      <InputBarContainer>
        <TextInput
          value={text}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && text.trim() !== "") {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={
            writeInCurrentCategory
              ? 'Capture a spark to ' + (currentCategory === 'Unsorted' ? 'Miscellaneous' : currentCategory) + '...'
              : 'Capture a spark...'
          }
          disabled={isLoading}
          rows={1}
          style={{ paddingBottom: parsedDateHint ? '2.2em' : undefined }}
        />
        {isFocused && (
          <SubmitButton type="submit" disabled={isLoading || noteLoading}>
            {noteLoading ? <FaSquare size={14}/> : <FaArrowUp size={14}/>}
          </SubmitButton>
        )}
        
        {/* Date hints */}
        {parsedDateHint && (
          <DateHint>
            <FaClock size={14} />
            {parsedDateHint}
          </DateHint>
        )}
      </InputBarContainer>
    </TextBarForm>
  );
};
