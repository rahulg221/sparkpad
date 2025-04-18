import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Note } from '../../models/noteModel';
import { NoteService } from '../../api/noteService';
import { SmallHeader } from '../../components/toolbar/ToolBar.Styles';
import { ElevatedContainer, Grid, Row, Spacer } from '../../styles/shared/BaseLayout';
import { NoteCard, NoteInfo, NotePreview, SmallIconButton } from './NotesList.Styles';
import { SecondaryButton, TextButton } from '../../styles/shared/Button.styles';
import { MdArrowBack, MdArrowForward, MdLogout, MdEventAvailable } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { FaBars, FaBorderAll, FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';
import { Modal } from '../modal/Modal';
import { ModalContent } from '../modal/Modal.Styles'; 
import { ThemeToggle } from '../themetoggle/ThemeToggle';
import { CustomDropdown } from '../dropdown/Dropdown';
import { useActions } from '../../context/ActionsContext';

interface NotesListProps {
  category: string;
}

export const NotesList = ({ category }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [$layoutMode, setLayoutMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const limit = 15;
  const [isUpdateNoteOpen, setIsUpdateNoteOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [noteToUpdate, setNoteToUpdate] = useState<Note | null>(null);
  const { categories } = useActions();
  
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return;

      const offset = (page - 1) * limit;

      try {
        setIsLoading(true);
        const visibleNotes = await NoteService.getNotesByCategory(user.id, category, limit, offset);

        setNotes(visibleNotes);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch notes');
        console.error('Error fetching notes:', err);
        setIsLoading(false);
      } 
    };

    fetchNotes();
  }, [user?.id, page]);

  const handleDeleteNote = async (noteId: string) => {
    try {
      await NoteService.deleteNote(noteId);
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

  return (
    <>
      <Row main="spaceBetween" cross="center" gap="sm">
        { category == "Unsorted" ? <h1>Miscellaneous</h1> : <h1>{category.replace(/\*\*/g, "").split(" ").slice(0, 3).join(" ")}</h1>}
        {$layoutMode === 'grid' ? <FaBars size={14} onClick={() => setLayoutMode(prev => prev === 'grid' ? 'list' : 'grid')}/> : <FaBorderAll size={14} onClick={() => setLayoutMode(prev => prev === 'grid' ? 'list' : 'grid')}/>}
      </Row>
      <ElevatedContainer width='100%' padding='md'>
      {notes.length === 0 && <h2>No notes found</h2>}
        { isLoading ? <LoadingSpinner /> :
        <Grid columns={3} $layoutMode={$layoutMode}>
          {notes.map((note) => (
            <NoteCard key={note.id} $layoutMode={$layoutMode}>
              <NotePreview>
                <ReactMarkdown
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
      </ElevatedContainer>
      <Spacer height='md' />
      <Row main='center' cross='center'>
        <TextButton onClick={() => page > 1 ? setPage(page - 1) : null}>
          <Row main='center' cross='center' gap='sm'> 
            <MdArrowBack size={16} />
            Previous
          </Row>
        </TextButton>
        <TextButton onClick={() => setPage(page + 1)}>
          <Row main='center' cross='center' gap='sm'> 
            Next
            <MdArrowForward size={16} />
          </Row>
        </TextButton>
      </Row>
      <Spacer height='md' />
      {isUpdateNoteOpen && (
          <Modal
                isOpen={true}
                onClose={() => setIsUpdateNoteOpen(false)}
                onSave={() => handleUpdateNote(noteToUpdate!.id!)}
                title="Edit Note"
            >
            <ModalContent>
              <SmallHeader>Move to</SmallHeader>
              <CustomDropdown value={newCategory} onChange={(val: string | number) => setNewCategory(val as string)} options={categories} />
            </ModalContent>
          </Modal>
        )}
    </>
  );
}; 