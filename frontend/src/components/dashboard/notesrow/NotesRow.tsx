import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { Note } from '../../../models/noteModel';
import { NoteService } from '../../../api/noteService';
import { NoteInfo, NotePreview, NewNoteCard, Icon } from './NotesRow.Styles';
import { Row, ScrollView, Spacer } from '../../../styles/shared/BaseLayout';
import { Container } from '../../../styles/shared/BaseLayout';
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from '../../../styles/shared/LoadingSpinner';
import { IconButton } from '../../../styles/shared/Button.styles';
import { FaTimes, FaTrash, FaChevronUp, FaMagic, FaThumbtack } from 'react-icons/fa';
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
        //const recentNotes = await NoteService.getMostRecentNotes(user?.id!, 15);
        const unlockedNotes = await NoteService.getUnlockedNotes(user?.id!, lockedCategories);
        setRecentNotes(unlockedNotes);
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
      await NoteService.deleteNote(user?.id!, noteId, lockedCategories);
      setRecentNotes(recentNotes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <>
    <NotesRowContainer $isRecentNotesVisible={showRecentNotes}>            
        <Row main="spaceBetween" cross="start">
            <h1>Wild Sparks</h1>
            <IconButton onClick={() => setShowRecentNotes(false)}>
                <FaThumbtack size={14} />
            </IconButton>
        </Row>
        <Spacer height="md" />
          <ScrollView direction='horizontal'>
              <Container width="100%">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Row main="start" cross="start" gap="md">
                  {recentNotes.map(note => (
                      <NewNoteCard key={note.id}>
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
                              <Icon>
                                <FaFire size={14} />
                              </Icon>
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
