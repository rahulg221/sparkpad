import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    DashboardWrapper,
    Header,
} from './Dashboard.Styles';
import { SecondaryButton } from '../../styles/shared/Button.styles';
import { NoteCategories } from '../categories/NoteCategories';
import { NotesList } from '../noteslist/NotesList';
import { NoteService } from '../../api/noteService';
import { SearchBar } from '../searchbar/SearchBar';
import { NoteCard, NoteContent, NoteMeta, NotesContainer, NoteInfo, TrashIcon, CategoryTitle } from '../noteslist/NotesList.Styles';
import { Note } from '../../models/noteModel';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Notification } from '../notif/Notification';
import { Modal } from '../modal/Modal';
import { useActions } from '../../context/ActionsContext';
import { MdPsychology, MdCameraAlt, MdEventAvailable, MdSettings, MdArrowBack, MdHome, MdLogout } from 'react-icons/md';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const { showSnapshot, autoOrganizeNotes, setShowNotification, setSummary, isLoading, notificationMessage, showNotification, summary } = useActions();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [showSettings, setShowSettings] = useState(false);

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

    const handleSearch = async (query: string) => {
        if (!user?.id) return;

        try {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }

            const results = await NoteService.searchNotes(user.id, query);
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        } 
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
          await NoteService.deleteNote(noteId);
          setNotes(notes.filter(note => note.id !== noteId));
        } catch (err) {
          console.error('Error deleting note:', err);
        }
    };

    const handleSettingsClick = () => {
        setShowSettings(true);
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
                <SecondaryButton onClick={handleBackClick}>
                    <MdHome size={20}/>
                </SecondaryButton>
                <SearchBar onSearch={handleSearch} />
                <SecondaryButton onClick={autoOrganizeNotes}>
                    <MdPsychology size={20}/>
                    Organize
                </SecondaryButton>
                <SecondaryButton onClick={() => showSnapshot()}>
                    <MdCameraAlt size={20}/>
                    Snapshot
                </SecondaryButton>
                <SecondaryButton onClick={autoOrganizeNotes}>
                    <MdEventAvailable size={20}/>
                    Calendar
                </SecondaryButton>
                <SecondaryButton onClick={handleSettingsClick}>
                    <MdSettings size={20}/>
                </SecondaryButton>
                <SecondaryButton onClick={handleLogout}>
                    <MdLogout size={20}/>
                </SecondaryButton>
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
    
                        />
                    ) : (
                                <NoteCategories handleCategoryClick={handleCategoryClick} />
                            )}
                        </>
                    )}
                </>
            )}
            {showSettings && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowSettings(false)}
                title="Settings"
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>Settings Screen</ReactMarkdown>     
            </Modal>
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