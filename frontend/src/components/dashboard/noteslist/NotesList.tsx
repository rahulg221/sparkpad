import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { Note } from '../../../models/noteModel';
import { NoteService } from '../../../api/noteService';
import { SmallHeader } from '../../toolbar/ToolBar.Styles';
import { Column, Grid, Row, Spacer } from '../../../styles/shared/BaseLayout';
import { NoteCard, NoteInfo, NotePreview, NoteContainer, NoteListContainer } from './NotesList.Styles';
import { SecondaryButton, TextButton } from '../../../styles/shared/Button.styles';
import { MdArrowBack, MdArrowForward, MdLogout, MdEventAvailable } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from '../../../styles/shared/LoadingSpinner';
import { FaBars, FaBorderAll, FaTrash } from 'react-icons/fa';
import { FaArrowLeft, FaArrowRight, FaPen, FaTable, FaTableList } from 'react-icons/fa6';
import { Modal } from '../../modal/Modal';
import { ModalContent } from '../../modal/Modal.Styles'; 
import { ThemeToggle } from '../../modal/themetoggle/ThemeToggle';
import { CustomDropdown } from '../../dropdown/Dropdown';
import { useActions } from '../../../context/ActionsContext';
import { UpdateNoteModal } from '../../modal/UpdateNoteModal';
import { useNotes } from '../../../context/NotesProvider';
import remarkGfm from 'remark-gfm';
import { IconButton, SmallIconButton } from '../../../styles/shared/Button.styles';
import { InputBar } from '../../inputbar/InputBar';
import { motion } from 'framer-motion';
import { DateFilter } from './DateFilter';

interface NotesListProps {
  category: string;
  lockedCategories: string[];
}

export const NotesList = ({ category, lockedCategories }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const { user } = useAuth();
  const [$layoutMode, setLayoutMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isUpdateNoteOpen, setIsUpdateNoteOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [noteToUpdate, setNoteToUpdate] = useState<Note | null>(null);
  const [totalNotes, setTotalNotes] = useState(0);
  const { categories, isSidebarVisible, isToolBarCollapsed } = useActions();
  const { refreshNotes, isSearchLoading } = useNotes();
  const notesContainerRef = useRef<HTMLDivElement>(null);

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

  const handleDeleteNote = async (noteId: string) => {
    try {
      await NoteService.deleteNote(noteId, user?.id || '', lockedCategories);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Error deleting note');
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    try {
      await NoteService.updateNote(noteId, newCategory);
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
          <FaArrowLeft size={16} />
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
          <FaArrowRight size={16} />
        </IconButton>
      </Row>
      <Spacer height='lg' />
      <NoteContainer ref={notesContainerRef} $isUnsorted={category === 'Unsorted'}>
      {notes.length === 0 && <h2>No notes found for {date}.</h2>}
        { isLoading || isSearchLoading ? <LoadingSpinner /> :
        <Grid $columns={3} $layoutMode={$layoutMode}>
          {notes.map((note) => (
            <NoteCard key={note.id} $layoutMode={$layoutMode} $isUnsorted={note.category === "Unsorted"}>
              <NotePreview $layoutMode={$layoutMode} $isUnsorted={note.category === "Unsorted"}>
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
              </NotePreview>
              <NoteInfo $isUnsorted={note.category === "Unsorted"}>
                {new Date(note.created_at!).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                <Spacer expand={true} />
                <SmallIconButton onClick={() => {
                  setNoteToUpdate(note);
                  setIsUpdateNoteOpen(true);
                }}>
                  <FaPen size={14} />
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
              onSave={() => handleUpdateNote(noteToUpdate!.id!)}
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