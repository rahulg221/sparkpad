import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { deleteNote, getNotesByCategory } from '../../api/noteMethods';
import { NotesContainer, NoteCard, NoteContent, NoteMeta, CategoryTitle, NoteInfo, TrashIcon } from './NotesList.Styles';
import { SecondaryButton } from '../../styles/shared/Button.styles';

interface NotesListProps {
  category: string;
  onBackClick: () => void;
}

export const NotesList = ({ category, onBackClick }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const userNotes = await getNotesByCategory(user.id, category);
        setNotes(userNotes);
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
      await deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Error deleting note');
    }
  };

  return (
    <NotesContainer>
      <SecondaryButton onClick={onBackClick}>Return to Dashboard</SecondaryButton>
      <CategoryTitle>{category}</CategoryTitle>
      {notes.map((note) => (
        <NoteCard key={note.id}>
          <NoteMeta>
            <NoteContent>
              {note.content}
            </NoteContent>
            <TrashIcon onClick={() => handleDeleteNote(note.id!)} />
          </NoteMeta>
          <NoteInfo>
              {new Date(note.created_at!).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              <br />
              {note.category}
          </NoteInfo>
        </NoteCard>
      ))}
    </NotesContainer>
  );
}; 