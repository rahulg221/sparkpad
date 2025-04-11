import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { NoteService } from '../../api/noteService';
import { ElevatedContainer, Grid, Row, Spacer } from '../../styles/shared/BaseLayout';
import { NoteCard, NoteContent, NoteInfo } from '../../styles/shared/Notes.styles';
import { TrashIcon } from './NotesList.Styles';
import { useActions } from '../../context/ActionsContext';
import { IconButton, SecondaryButton, TextButton } from '../../styles/shared/Button.styles';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

interface NotesListProps {
  category: string;
}

export const NotesList = ({ category }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { setCurrentNotes } = useActions();
  const [$layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [openNote, setOpenNote] = useState<Note | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return;

      const offset = (page - 1) * limit;

      try {
        setIsLoading(true);
        const userNotes = await NoteService.getNotesByCategory(user.id, category, 50, 0);
        const visibleNotes = await NoteService.getNotesByCategory(user.id, category, limit, offset);


        setNotes(visibleNotes);
        setCurrentNotes(userNotes);
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

  return (
    <>
      { category == "Unsorted" ? <h1>Miscellaneous</h1> : <h1>{category.replace(/\*\*/g, "").split(" ").slice(0, 2).join(" ")}</h1>}
      <ElevatedContainer width='100%' padding='lg'>
        <Grid columns={3} $layoutMode={$layoutMode}>
          {notes.map((note) => (
            <NoteCard key={note.id} onClick={() => setLayoutMode(prev => prev === 'grid' ? 'list' : 'grid')}>
              <NoteContent>
                {note.content}
              </NoteContent>
              <NoteInfo>
                  {new Date(note.created_at!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  <TrashIcon onClick={() => handleDeleteNote(note.id!)} />
              </NoteInfo>
            </NoteCard>
          ))}
        </Grid>
      </ElevatedContainer>
      <Spacer height='md' />
      <Row main='end' cross='center' gap='md'>
        <SecondaryButton onClick={() => page > 1 ? setPage(page - 1) : null}>
          <Row main='center' cross='center' gap='sm'> 
            <MdArrowBack size={16} />
            <h2>Previous</h2>
          </Row>
        </SecondaryButton>
        <SecondaryButton onClick={() => setPage(page + 1)}>
          <Row main='center' cross='center' gap='sm'> 
            <h2>Next</h2>
            <MdArrowForward size={16} />
          </Row>
        </SecondaryButton>
      </Row>
      <Spacer height='md' />
    </>
  );
}; 