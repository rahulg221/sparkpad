import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';

import {
    ButtonContainer, 
    DashboardWrapper,
    Header,
    SearchSection,
} from './Dashboard.Styles';
import { SecondaryButton } from '../../styles/shared/Button.styles';
import { NoteCategories } from '../categories/NoteCategories';
import { NotesList } from '../list/NotesList';
import { getNotes, groupAndLabelNotes, summarizeDailyNotes, searchNotes, deleteNote } from '../../api/noteMethods';
import { SearchBar } from '../searchbar/SearchBar';
import { NoteCard, NoteContent, NoteMeta, NotesContainer, NoteInfo, TrashIcon } from '../list/NotesList.Styles';
import { Note } from '../../models/noteModel';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [isSearching, setIsSearching] = useState(false);
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
            const summary = await summarizeDailyNotes(user?.id || '');
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
          <Lottie
            animationData={animation}
            loop
            autoplay
            style={{ width: 200, height: 200 }}
          />
        </div>
      );

    return (
        <DashboardWrapper>
            <Header>
                <SearchSection>
                    <SearchBar onSearch={handleSearch} />
                </SearchSection>
                <ButtonContainer>
                    <SecondaryButton onClick={handleSummarize}>Download Daily Report</SecondaryButton>
                    <SecondaryButton onClick={handleClustering}>Auto-Organize</SecondaryButton>
                    <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>
                </ButtonContainer>
            </Header>
            {searchResults.length > 0 ? (
                <NotesContainer>
                    <h2>Search Results</h2>
                    {searchResults.map((note) => (
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
        </DashboardWrapper>
    );
};