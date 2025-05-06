import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { Note } from '../../../models/noteModel';
import { NoteService } from '../../../api/noteService';
import { NoteInfo, NotePreview, NewNoteCard } from './NotesRow.Styles';
import { Row, ScrollView, Spacer } from '../../../styles/shared/BaseLayout';
import { Container } from '../../../styles/shared/BaseLayout';
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from '../../../styles/shared/LoadingSpinner';
import { IconButton, SmallIconButton } from '../../../styles/shared/Button.styles';
import { FaTimes, FaTrash, FaChevronUp, FaMagic, FaStickyNote } from 'react-icons/fa';
import { useNotes } from '../../../context/NotesProvider';
import { IoSparkles } from 'react-icons/io5';
import { NotesRowContainer } from './NotesRow.Styles';
import { FaFire } from 'react-icons/fa6';

export const NotesRow = () => {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, lockedCategories } = useAuth();
  const { refreshNotes, showRecentNotes, setShowRecentNotes } = useNotes();

  useEffect(() => {
    const fetchRecentNotes = async () => {
      //setIsLoading(true);

      try {
        if (user?.id) {
          const unlockedNotes = await NoteService.getUnlockedNotes(user.id, lockedCategories);
          setRecentNotes(unlockedNotes);
        } else {
          console.error('User not found');
          setRecentNotes([]);
        }
      } catch (err) {
        console.error('Error fetching recent notes:', err);
      } finally {
        setIsLoading(false);
      }   
    };

    fetchRecentNotes();
  }, [refreshNotes, showRecentNotes]);

  const handleDeleteNote = async (noteId: string) => {
    try {
      await NoteService.deleteNote(noteId, user?.id || '', lockedCategories);
      setRecentNotes(recentNotes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <>
    <NotesRowContainer $isRecentNotesVisible={showRecentNotes}>            
          <ScrollView direction='horizontal'>
              <Container width="100%">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Row main="start" cross="start" gap="md">
                  {recentNotes.map(note => (
                      <NewNoteCard key={note.id} $isUnsorted={note.category === "Unsorted"}>
                          <NotePreview $isUnsorted={note.category === "Unsorted"}>
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
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
                              <SmallIconButton onClick={() => {handleDeleteNote(note.id!)}}> <FaTrash size={14}/> </SmallIconButton>
                          </NoteInfo>
                      </NewNoteCard>
                  ))}
              </Row>
            )}
          </Container>
        </ScrollView>
        <Spacer height="lg" />  
    </NotesRowContainer>
    </>
  );
};
