import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { NoteService } from '../../api/noteService';
import { NoteCard, NoteContent, NoteInfo, NotesContainer } from './NotesRow.Styles';
import { ElevatedContainer } from '../noteslist/NotesList.Styles';
import { useActions } from '../../context/ActionsContext';
import { TrashIcon } from '../noteslist/NotesList.Styles';

export const NotesRow = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useAuth();
  const { setCurrentNotes } = useActions();

  useEffect(() => {
    const fetchRecentNotes = async () => {
      if (!user?.id) return;

      try {
        const recentNotes = await NoteService.getMostRecentNotes(user.id, 10);
        setNotes(recentNotes);
        setCurrentNotes(recentNotes);
      } catch (err) {
        console.error('Error fetching recent notes:', err);
      }
    };

    fetchRecentNotes();
  }, [user?.id]);

  const handleDeleteNote = async (noteId: string) => {
    try {
      await NoteService.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <>            
        <h1>New Sparks</h1>
        <ElevatedContainer>
            <NotesContainer>
                {notes.map(note => (
                    <NoteCard key={note.id}>
                        <NoteContent>{note.content}</NoteContent>
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
            </NotesContainer>
        </ElevatedContainer>
    </>
  );
};
