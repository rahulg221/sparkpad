import { useEffect, useState } from 'react';
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
import { NoteCard, NoteContent, NoteInfo } from '../../styles/shared/Notes.styles';
import { TrashIcon } from '../noteslist/NotesList.Styles';
import { Note } from '../../models/noteModel';
import { Notification } from '../notif/Notification';
import { Modal } from '../modal/Modal';
import { useActions } from '../../context/ActionsContext';
import { MdEventAvailable, MdLogout } from 'react-icons/md';
import CalendarService from '../../api/calendarService';
import { ThemeToggle } from '../themetoggle/ThemeToggle';
import { NotesRow } from '../notesrow/NotesRow';
import { Grid, ElevatedContainer, Spacer, Row } from '../../styles/shared/BaseLayout';
import { FaArrowLeft, FaLightbulb, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaGear, FaWandSparkles } from 'react-icons/fa6';

export const Dashboard = () => {
    const { user, signOut, isGoogleConnected, setIsGoogleConnected } = useAuth();
    const { showSummary, semanticSearch, autoOrganizeNotes, setShowNotification, setSearchResults, isLoading, notificationMessage, currentNotes, showNotification, searchResults, calendarEvents, tasks } = useActions();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showRecentNotes, setShowRecentNotes] = useState(false);

    useEffect(() => {
        const runOAuthCallback = async () => {
          if (isGoogleConnected) return;

          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          const isCallback = window.location.pathname.includes("/auth/google/callback");
      
          if (!code || !isCallback) return;
      
          try {
            await CalendarService.sendAuthCodeToBackend(code);

            setIsGoogleConnected(true);
    
            window.history.replaceState({}, document.title, "/dashboard");
          } catch (err) {
            console.error("OAuth failed", err);
          }
        };
      
        runOAuthCallback();
    }, []);      

    const handleLogout = async () => {{}
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
        setSearchResults([]);
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
          await NoteService.deleteNote(noteId);
          setSearchResults(searchResults.filter(note => note.id !== noteId));
        } catch (err) {
          console.error('Error deleting note:', err);
        }
    };

    const handleSettingsClick = () => {
        setShowSettings(true);
    };

    const handleSearch = async (query: string) => {
        try {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
    
            semanticSearch(query);
    
            console.log("searchResults", searchResults);
        } catch (error) {
            console.error('Search failed:', error);
        } 
      };

    const handleCalendarClick = async () => {
        try {
            const googleAuthUrl = await CalendarService.getGoogleAuthUrl();
            window.location.href = googleAuthUrl; 
        } catch (err) {
            console.error("Failed to get Google auth URL", err);
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
                <Row main='start' cross='start' gap='md'>
                    { selectedCategory || searchResults.length > 0 ? 
                        <SecondaryButton onClick={handleBackClick}>
                            <FaArrowLeft size={14}/>
                            <span className='text-label'>Back</span>
                        </SecondaryButton>
                    : null }
                    <SearchBar onSearch={handleSearch} />
                    <SecondaryButton onClick={() => setShowRecentNotes(prev => !prev)}>
                        {showRecentNotes ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
                        {showRecentNotes ? <span className='text-label'>Hide Recent</span> : <span className='text-label'>Show Recent</span>}
                    </SecondaryButton>
                    <SecondaryButton onClick={autoOrganizeNotes}>
                        <FaWandSparkles size={14}/>
                        <span className='text-label'>Organize</span>
                    </SecondaryButton>
                    <SecondaryButton onClick={() => showSummary()}>
                        <FaLightbulb size={14}/>
                        <span className='text-label'>Summarize</span>
                    </SecondaryButton>
                    <SecondaryButton onClick={handleSettingsClick}>
                        <FaGear size={14}/>
                        <span className='text-label'>Settings</span>
                    </SecondaryButton>
                </Row>
            </Header>
            {searchResults.length > 0 ? (
                <>
                <h1>Search Results</h1>
                <ElevatedContainer width='100%' padding='lg'>
                    <Grid columns={1} $layoutMode='list'>
                        {searchResults.map((note) => (
                            <NoteCard key={note.id}>
                            <NoteContent>
                                {note.content}
                            </NoteContent>
                                <NoteInfo>
                                    {note.category == 'Unsorted' ? 'Miscellaneous' : note.category.replace(/\*\*/g, "").split(" ").slice(0, 2).join(" ")}
                                    <br/>
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
                    </Grid>
                </ElevatedContainer>
              </>
            ) : (
                <>
                    {isLoading ? <Loader /> : (
                        <>  
                            {showRecentNotes ? 
                                <>
                                    <NotesRow/>
                                    <Spacer height='lg'/>
                                </>
                             : null}
                            {selectedCategory ? (
                                <NotesList category={selectedCategory} />
                            ) : (
                                <>
                                    { currentNotes.length > 0 ? (
                                        <>
                                            <h1>My Notepads</h1>
                                            
                                        </>
                                    ) : (
                                        <h1>Quick Start Guide</h1>
                                    )}
                                    <NoteCategories handleCategoryClick={handleCategoryClick} />
                                </>
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
                <h2>Under construction</h2>
                <ThemeToggle />
                <SecondaryButton onClick={handleCalendarClick}>
                    <MdEventAvailable size={20}/>
                    <span className='text-label'>Connect</span>
                </SecondaryButton>
                <SecondaryButton onClick={handleLogout}>
                    <MdLogout size={20}/>
                    Logout
                </SecondaryButton>
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