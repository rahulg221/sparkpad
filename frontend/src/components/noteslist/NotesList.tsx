import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Note } from '../../models/noteModel';
import { NoteService } from '../../api/noteService';
import { NotesContainer, NoteCard, NoteMeta, CategoryTitle, NoteInfo, TrashIcon } from './NotesList.Styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useActions } from '../../context/ActionsContext';
import { MdList, MdGridOn } from 'react-icons/md';
import { SecondaryButton } from '../../styles/shared/Button.styles';

interface NotesListProps {
  category: string;
}

export const NotesList = ({ category }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { setCurrentNotes } = useActions();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CategoryTitle>
          {category}
        </CategoryTitle>
        <SecondaryButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
          {viewMode === 'grid' ? <MdList size={20}/> : <MdGridOn size={20}/>}
        </SecondaryButton>
      </div>
      <NotesContainer viewMode={viewMode}>
        {notes.map((note) => (
          <NoteCard key={note.id}>
            <NoteMeta>
              {note.content}
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
            </NoteMeta>
          </NoteCard>
        ))}
    </NotesContainer>
    </>
  );
}; 