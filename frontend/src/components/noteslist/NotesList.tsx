import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { NoteService } from '../../api/noteService';
import { NotesContainer, NoteCard, NoteContent, NoteInfo, TrashIcon, ElevatedContainer} from './NotesList.Styles';
import { useActions } from '../../context/ActionsContext';
import { MdList, MdGridOn } from 'react-icons/md';
import { SecondaryButton } from '../../styles/shared/Button.styles';
import { Modal } from '../modal/Modal';
import { ModalContent } from '../modal/Modal.Styles';

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

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const userNotes = await NoteService.getNotesByCategory(user.id, category);
        setNotes(userNotes);
        setCurrentNotes(userNotes);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch notes');
        console.error('Error fetching notes:', err);
        setIsLoading(false);
      } 
    };

    fetchNotes();
  }, [user?.id]);

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
      { category == "Unsorted" ? <h1>Miscellaneous</h1> : <h1>{category}</h1>}  
      <ElevatedContainer>
        <NotesContainer $layoutMode={$layoutMode}>
          {notes.map((note) => (
            <NoteCard key={note.id} onClick={() => setOpenNote(note)}>
              <NoteContent>
                {note.content}
              </NoteContent>
              <NoteInfo>
                  {note.category}
                  <br />
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
        </NotesContainer>
      </ElevatedContainer>
    </>
  );
}; 