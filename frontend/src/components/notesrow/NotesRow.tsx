import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { NoteService } from '../../api/noteService';
import { NoteContent, NoteInfo } from './NotesRow.Styles';
import { NewNoteCard } from '../../styles/shared/Notes.styles';
import { useActions } from '../../context/ActionsContext';
import { TrashIcon } from '../noteslist/NotesList.Styles';
import { Row, ScrollView } from '../../styles/shared/BaseLayout';
import { Container } from '../../styles/shared/BaseLayout';

export const NotesRow = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useAuth();
  const { setCurrentNotes } = useActions();
  const [showRecentNotes, setShowRecentNotes] = useState(false);

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
        <h1>Recent Sparks</h1>
        <ScrollView direction='horizontal'>
                <Container width="100%">
                    <Row main="start" cross="start" gap="md">
                    {notes.map(note => (
                        <NewNoteCard key={note.id}>
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
                        </NewNoteCard>
                    ))}
                </Row>
            </Container>
        </ScrollView>
    </>
  );
};
