import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { Note } from '../../../models/noteModel';
import { NoteService } from '../../../api/noteService';
import { Column, Grid, Row, Spacer } from '../../../styles/shared/BaseLayout';
import { NoteCard, NoteInfo, NotePreview, NoteContainer, NoteListContainer } from './NotesList.Styles';
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from '../../../styles/shared/LoadingSpinner';
import { FaInfoCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';
import { FaArrowLeft, FaArrowRight, FaArrowUpRightFromSquare, FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa6';
import { useActions } from '../../../context/ActionsContext';
import { UpdateNoteModal } from '../../modal/UpdateNoteModal';
import { useNotes } from '../../../context/NotesProvider';
import remarkGfm from 'remark-gfm';
import { IconButton, SmallIconButton } from '../../../styles/shared/Button.styles';
import { InputBar } from '../../inputbar/InputBar';
import { useTheme } from 'styled-components';
import { extractDateAndText } from '../../../utils/dateParse';
import { IoSparkles } from 'react-icons/io5';
import { motion } from 'framer-motion';

interface NotesListProps {
  category: string;
  lockedCategories: string[];
}

export const NotesList = ({ category, lockedCategories }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [parsedDateHint, setParsedDateHint] = useState<string | null>(null);
  const { user } = useAuth();
  const [$layoutMode, setLayoutMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [isUpdateNoteOpen, setIsUpdateNoteOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [noteToUpdate, setNoteToUpdate] = useState<Note | null>(null);
  const [totalNotes, setTotalNotes] = useState(0);
  const { setNotificationType, updateTasks, updateEvents, categories, isSidebarVisible, isToolBarCollapsed, setNotificationMessage, setShowNotification } = useActions();
  const { refreshNotes, isSearchLoading, draftNote, setDraftNote, setRefreshNotes, writeInCurrentCategory } = useNotes();
  const notesContainerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const theme = useTheme();

  useEffect(() => {
    if (writeInCurrentCategory && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [writeInCurrentCategory]);

  useEffect(() => {
    fetchNotes();

    if(category === 'Unsorted') {
      setLayoutMode('grid');
    } else {
      setLayoutMode('list');
    }

  }, [user?.id, page, refreshNotes, limit, category]);

  const fetchNotes = async () => {
    console.log('fetching notes');
    if (!user?.id) return;

    try {
      const count = await NoteService.getNotesCountByCategory(user.id, category);
      setTotalNotes(count);
  
      const computedOffset = (page - 1) * limit;
      const visibleNotes = await NoteService.getNotesByCategory(
        user.id,
        category,
        limit,
        computedOffset,
        date
      );
  
      setNotes(visibleNotes);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
      setIsLoading(false);
    }
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (draftNote.trim() === '') return;

    let notificationMessage = '';

    setNotificationMessage('Writing in notebook...');
    setShowNotification(true);
    setNotificationType('note');

    try {
      if (draftNote.startsWith('/e')) {
        const { dateTimeString, content } = await extractDateAndText(draftNote);

        const note: Note = {
          content: draftNote.trim(),
          user_id: user?.id || '',
          category: category, 
          cluster: -1,
        };

        notificationMessage = await NoteService.addNote(note, dateTimeString, content);
        setNotificationType('event');
        setParsedDateHint('');
      } 
      else {
        if (draftNote.startsWith('/t')) {
          setNotificationType('task');
        } else {
          setNotificationType('note');
        }

        const note: Note = {
          content: draftNote.trim(),
          user_id: user?.id || '',
          category: category,
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
      setDraftNote('');

      setRefreshNotes(!refreshNotes); // toggle it
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
    } 
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setNotes(prev =>
        prev.map(note =>
          note.id === noteId ? { ...note, isDeleting: true } : note
        )
      );
    
      await NoteService.deleteNote(noteId, user?.id || '', lockedCategories);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Error deleting note');
    }
  };

  const handleUpdateNote = async (noteId: string, content: string) => {
    try {
      await NoteService.updateNote(noteId, content, newCategory);
      setNotes(notes.filter(note => note.id !== noteId));
      setIsUpdateNoteOpen(false);
    } catch (err) {
      console.error('Error updating note:', err);
    }
  }

  const handleLayoutMode = () => {
    setLayoutMode(prev => prev === 'grid' ? 'list' : 'grid');
  }
  
  return (
    <NoteListContainer>
      <Column main="start" cross="start" width="100%">
        <Row main="start" cross="start" gap="sm">    
          <h1>
          {category === 'Unsorted' ? 'Sticky Notes' : category}
        </h1>
        <Spacer expand={true} />
        <IconButton
          onClick={() => {
              if (page > 1) {
                setPage(page - 1);
                notesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
          <FaChevronLeft size={14} />
        </IconButton>
        <IconButton
          onClick={() => {
            const maxPage = Math.ceil(totalNotes / limit);
              if (page < maxPage) {
                setPage(page + 1);
                notesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
          <FaChevronRight size={14} />
        </IconButton>
      </Row>
      {notes.length === 0 && categories.length === 1 && (
        <>
          <Spacer height="md" />
          <p>Press Q or click the pencil icon to create a sticky note.</p>
        </>
      )}
      <NoteContainer ref={notesContainerRef} $isUnsorted={category === 'Unsorted'}>
      {draftNote !== null && category !== 'Unsorted' && (
        <NoteCard $layoutMode={$layoutMode} $isUnsorted={category === "Unsorted"} isDeleting={false}>
          <NotePreview $layoutMode={$layoutMode} $isUnsorted={category === "Unsorted"}>
            <textarea
              value={draftNote}
              ref={textInputRef}
              maxLength={1000}
              onChange={(e) => setDraftNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.blur(); // triggers save via onBlur
                }
              }}              
              onBlur={async (e) => {
                handleSubmit(e);
              }}
              autoFocus
              placeholder="Write here..."
              style={{
                width: '100%',
                height: '100%',
                resize: 'none',
                background: 'transparent',
                border: 'none',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                color: theme.colors.textPrimary,
                outline: 'none',
              }}
            />
          </NotePreview>
        </NoteCard>
      )}
        { isSearchLoading ? <LoadingSpinner /> :
        <Grid $columns={3} $layoutMode={$layoutMode} gap={$layoutMode === "grid" ? "md" : "none"}>
          {notes.map((note) => (
            <NoteCard key={note.id} $layoutMode={$layoutMode} $isUnsorted={note.category === "Unsorted"} isDeleting={note.isDeleting || false}>
              <NotePreview $layoutMode={$layoutMode} $isUnsorted={note.category === "Unsorted"}>
                {editingNoteId === note.id ? (
                  <textarea
                    value={editedContent}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.blur(); // triggers save via onBlur
                      }
                    }}                    
                    onChange={(e) => setEditedContent(e.target.value)}
                    onBlur={async () => {
                      const updatedContent = editedContent.trim();
                      if (updatedContent && updatedContent !== note.content) {
                        await NoteService.updateNote(note.id!, updatedContent, note.category!);
                        setRefreshNotes(!refreshNotes);
                      }
                      setEditingNoteId(null);
                    }}
                    autoFocus
                    style={{
                      width: '100%',
                      height: '100%',
                      resize: 'none',
                      background: 'transparent',
                      border: 'none',
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      color: theme.colors.textPrimary,
                      outline: 'none',
                    }}
                  />
                ) : (
                  <div
                    onClick={() => {
                      setEditingNoteId(note.id!);
                      setEditedContent(note.content!);
                    }}
                    style={{ cursor: 'text' }}
                  >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
                          ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
                          li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
                        }}
                      >
                          {note.content}
                      </ReactMarkdown>
                  </div>
                )}
              </NotePreview>
              <NoteInfo $isUnsorted={note.category === "Unsorted"}>
                {new Date(note.created_at!).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {note.recentlyMoved && ' - This note was auto-organized here. You can move it anytime.'}
                {note.recentlyMoved && <FaTimesCircle size={12} style={{ cursor: 'pointer', marginTop: '3px', marginLeft: '5px' }} onClick={() => {
                  NoteService.updateNote(note.id!, note.content!, note.category!, false);
                  setRefreshNotes(!refreshNotes);
                }}>Ignore</FaTimesCircle>}
                <Spacer expand={true} />
                <SmallIconButton onClick={() => {
                      setNoteToUpdate(note);
                      setIsUpdateNoteOpen(true);
                  }}>
                  <FaArrowUpRightFromSquare size={14} />
                </SmallIconButton>
                <Spacer width='sm' />
                <SmallIconButton onClick={() => handleDeleteNote(note.id!)}>
                    <FaTrash size={14} />
                </SmallIconButton>
              </NoteInfo>
            </NoteCard>
          ))}
        </Grid>
        }
        <Row main='end' cross='center'>
      </Row>
      </NoteContainer>
      <p style={{ marginTop: '8px' }}>Page {page} of {Math.ceil(totalNotes / limit)}</p>
      <InputBar />
      {isUpdateNoteOpen && (
          <UpdateNoteModal
              isOpen={isUpdateNoteOpen}
              onClose={() => setIsUpdateNoteOpen(false)}
              onSave={() => handleUpdateNote(noteToUpdate!.id!, noteToUpdate!.content!)}
              noteContent={noteToUpdate?.content || ''}   
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              categories={categories}
          />
      )}
    </Column>
    </NoteListContainer>
  );
}; 