import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    ButtonContainer, 
    DashboardWrapper,
    Header,
    SearchSection,
} from './Dashboard.Styles';
import { SecondaryButton } from '../../styles/shared/Button.styles';
import { NoteCategories } from '../categories/NoteCategories';
import { NotesList } from '../list/NotesList';
import { getNotes, groupAndLabelNotes, summarizeWeeklyNotes, searchNotes, deleteNote } from '../../api/noteMethods';
import { SearchBar } from '../searchbar/SearchBar';
import { NoteCard, NoteContent, NoteMeta, NotesContainer, NoteInfo, TrashIcon, CategoryTitle } from '../list/NotesList.Styles';
import { Note } from '../../models/noteModel';
import ChromeDinoGame from 'react-chrome-dino';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Notification } from '../notif/Notification';
import { Lottie } from 'react-lottie-player';
import animation from '../../assets/animation.json';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const handleBackClick = () => {
        setSelectedCategory(null);
    };

    const handleClustering = async () => {
        try {
            const notes = await getNotes(user?.id || '');
            if (notes.length < 16) {
                setNotificationMessage('You need at least 15 notes to auto-organize');
                setShowNotification(true);
                return;
            }
            setIsLoading(true);
            await groupAndLabelNotes(notes);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error('Error testing clustering:', err);
        }
    };

    const handleSummarize = async () => {
        try {
            setIsLoading(true);
            const summary = await summarizeWeeklyNotes(user?.id || '');
            console.log(summary);
            setIsLoading(false);
        } catch (err) {
            console.error('Error summarizing daily notes:', err);
            setIsLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (!user?.id) return;

        try {
            setIsSearching(true);
            
            if (!query.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            const results = await searchNotes(user.id, query);
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
          await deleteNote(noteId);
          setNotes(notes.filter(note => note.id !== noteId));
        } catch (err) {
          console.error('Error deleting note:', err);
          setError('Error deleting note');
        }
    };

    const Loader = () => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
            <h1>Loading...</h1>
        </div>
      );

    return (
        <DashboardWrapper>
            <Header>
                <SearchSection>
                    <SearchBar onSearch={handleSearch} />
                </SearchSection>
                <ButtonContainer>
                    <SecondaryButton onClick={handleSummarize}>Download Weekly Report</SecondaryButton>
                    <SecondaryButton onClick={handleClustering}>Auto-Organize</SecondaryButton>
                    <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>
                </ButtonContainer>
            </Header>
            {searchResults.length > 0 ? (
                <>
                <CategoryTitle>Search Results</CategoryTitle>
                <NotesContainer>
                {searchResults.map((note) => (
                  <NoteCard key={note.id}>
                    <NoteMeta>
                      <NoteContent>
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
                      </NoteContent>
                      <NoteInfo>
                          {note.category}
                          <br />
                          {new Date(note.created_at!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          <TrashIcon onClick={() => handleDeleteNote(note.id!)} />
                      </NoteInfo>
                    </NoteMeta>
                  </NoteCard>
                ))}
              </NotesContainer>
              </>
            ) : (
                <>
                    {isLoading ? <Loader /> : (
                        <>
                            {selectedCategory ? (
                                <NotesList 
                                    category={selectedCategory}
                            onBackClick={handleBackClick}
                        />
                    ) : (
                                <NoteCategories handleCategoryClick={handleCategoryClick} />
                            )}
                        </>
                    )}
                </>
            )}
            {showNotification && (
                <Notification 
                    message={notificationMessage} 
                    onClose={() => setShowNotification(false)} 
                />
            )}
        </DashboardWrapper>
    );
};