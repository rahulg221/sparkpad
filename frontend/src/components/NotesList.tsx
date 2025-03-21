import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Note } from '../models/noteModel';
import { getNotes, getNotesByCluster } from '../api/noteMethods';
import styled from 'styled-components';

const NotesContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: calc(${({ theme }) => theme.spacing.lg} + 160px);
  max-width: 1200px;
  margin: 0 auto;
`;

const NoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const NoteContent = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NoteMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CategoryTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

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
        const userNotes = await getNotesByCluster(user.id, parseInt(category));
        setNotes(userNotes);
      } catch (err) {
        setError('Failed to fetch notes');
        console.error('Error fetching notes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user?.id]);

  if (isLoading) return <div>Loading notes...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!notes.length) return <div>Create your first note!</div>;

  return (
    <NotesContainer>
      <BackButton onClick={onBackClick}>← Back to Categories</BackButton>
      <CategoryTitle>{category}</CategoryTitle>
      {notes.map((note) => (
        <NoteCard key={note.id}>
          <NoteContent>{note.content}</NoteContent>
          <NoteMeta>
            <span>Category: {note.category}</span>
            <span>Cluster: {note.cluster}</span>
          </NoteMeta>
        </NoteCard>
      ))}
    </NotesContainer>
  );
}; 