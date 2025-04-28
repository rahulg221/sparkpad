import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Note } from '../../models/noteModel';
import { NoteService } from '../../api/noteService';
import { SmallHeader } from '../../components/toolbar/ToolBar.Styles';
import { Grid, Row, Spacer } from '../../styles/shared/BaseLayout';
import { NoteCard, NoteInfo, NotePreview, SmallIconButton, NoteContainer } from './NotesList.Styles';
import { SecondaryButton, TextButton } from '../../styles/shared/Button.styles';
import { MdArrowBack, MdArrowForward, MdLogout, MdEventAvailable } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { FaBars, FaBorderAll, FaTrash } from 'react-icons/fa';
import { FaPen, FaTable, FaTableList } from 'react-icons/fa6';
import { Modal } from '../modal/Modal';
import { ModalContent } from '../modal/Modal.Styles'; 
import { ThemeToggle } from '../themetoggle/ThemeToggle';
import { CustomDropdown } from '../dropdown/Dropdown';
import { useActions } from '../../context/ActionsContext';
import { UpdateNoteModal } from '../modal/UpdateNoteModal';
import { useNotes } from '../../context/NotesProvider';
import remarkGfm from 'remark-gfm';
import { IconButton } from '../../styles/shared/Button.styles';

interface NotesListProps {
  category: string;
}

export const NotesList = ({ category }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [$layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [isUpdateNoteOpen, setIsUpdateNoteOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [noteToUpdate, setNoteToUpdate] = useState<Note | null>(null);
  const [totalNotes, setTotalNotes] = useState(0);
  const { categories } = useActions();
  const { refreshNotes } = useNotes();

  useEffect(() => {
    fetchNotes();

    if (window.innerWidth < 768) {
      setLayoutMode('list');
    }
  }, [user?.id, page, refreshNotes, limit]);

  const fetchNotes = async () => {
    console.log('fetching notes');
    if (!user?.id) return;
  
    const count = await NoteService.getNotesCountByCategory(user.id, category);
    setTotalNotes(count);
  
    const computedOffset = (page - 1) * limit;
  
    try {
      setIsLoading(true);
      const visibleNotes = await NoteService.getNotesByCategory(user.id, category, limit, computedOffset);
  
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
      await NoteService.deleteNote(noteId, user?.id || '');
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
    <>
      <Row main="spaceBetween" cross="center" gap="sm">
        <Row main='start' cross='center' gap='sm'>
          { category == "Unsorted" ? <h1>Miscellaneous</h1> : <h1>{category.replace(/\*\*/g, "").split(" ").slice(0, 3).join(" ")}</h1>}
        </Row>
        <Row main='end' cross='center' gap='sm'>
          <p>Page {page} of {Math.ceil(totalNotes / limit)}</p>
          <IconButton title="Toggle layout" onClick={handleLayoutMode}>
            {$layoutMode === 'grid' ? <FaTableList size={14} /> : <FaTable size={14} />}
          </IconButton>
        </Row>
      </Row>
      <NoteContainer>
      {notes.length === 0 && <h2>No notes found</h2>}
        { isLoading ? <LoadingSpinner /> :
        <Grid columns={3} $layoutMode={$layoutMode}>
          {notes.map((note) => (
            <NoteCard key={note.id} $layoutMode={$layoutMode}>
              <NotePreview $layoutMode={$layoutMode}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
                    li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
                  }}
                >
                  {note.content}
                </ReactMarkdown>
              </NotePreview>
              <NoteInfo>
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
      </NoteContainer>
      <Spacer height='md' />
      <Row main='center' cross='center'>
      <TextButton
        onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        >
        <Row main="center" cross="center" gap="sm">
          <MdArrowBack size={16} />
          Previous
        </Row>
      </TextButton>
      <TextButton
        onClick={() => {
          const maxPage = Math.ceil(totalNotes / limit);
            if (page < maxPage) {
              setPage(page + 1);
            }
          }}
        >
        <Row main="center" cross="center" gap="sm">
          Next
          <MdArrowForward size={16} />
        </Row>
      </TextButton>
      </Row>
      <Spacer height='xl' />
      <Spacer height='xl' />
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
    </>
  );
}; 