import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { 
    DashboardWrapper,
    Header,
} from './Dashboard.Styles';
import { SecondaryButton, TextButton } from '../../styles/shared/Button.styles';
import { NoteCategories } from '../categories/NoteCategories';
import { NotesList } from '../noteslist/NotesList';
import { NoteService } from '../../api/noteService';
import { NoteCard, NoteContent, NoteInfo } from '../../styles/shared/Notes.styles';
import { TrashIcon } from '../noteslist/NotesList.Styles';
import { Notification } from '../notif/Notification';
import { Modal } from '../modal/Modal';
import { useActions } from '../../context/ActionsContext';
import { MdEventAvailable, MdLogout } from 'react-icons/md';
import CalendarService from '../../api/calendarService';
import { ThemeToggle } from '../themetoggle/ThemeToggle';
import { NotesRow } from '../notesrow/NotesRow';
import { Grid, ElevatedContainer, Spacer, Row } from '../../styles/shared/BaseLayout';
import { FaArrowLeft } from 'react-icons/fa';
import { FaFolderTree, FaGear } from 'react-icons/fa6';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { TreeView } from '../tree/Tree';
import { Summary } from '../summary/Summary';
import { IoSparkles } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import { useSummary } from '../../context/SummaryProvider';
import { useNotes } from '../../context/NotesProvider';
export const Dashboard = () => {
    const { signOut, isGoogleConnected, setIsGoogleConnected } = useAuth();
    const { setIsSettingsVisible, isSettingsVisible, setShowNotification, isLoading, notificationMessage, categories, showNotification } = useActions();
    const { isSummaryVisible } = useSummary();
    const { currentCategory, showTree, setCurrentCategory, setShowTree } = useNotes();
    const navigate = useNavigate();
    const [showRecentNotes, setShowRecentNotes] = useState(false);
    const { isNoteLoading, searchResults, semanticSearch, setSearchResults } = useNotes();

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
        setCurrentCategory(category);
    };

    const handleBackClick = () => {
        setCurrentCategory('');
        setSearchResults([]);
        setShowTree(false);
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
          await NoteService.deleteNote(noteId);
          setSearchResults(searchResults.filter(note => note.id !== noteId));
        } catch (err) {
          console.error('Error deleting note:', err);
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

    const handleTreeClick = () => {
        setShowTree(true);
    };

    return (
        <DashboardWrapper>
            <Header>
                <Row main="spaceBetween" cross="center" gap="md">
                    {(showTree || currentCategory || searchResults.length > 0) && (
                        <TextButton onClick={handleBackClick}>
                            <Row main="center" cross="center" gap="sm">
                                <FaArrowLeft size={14} />
                                Back
                            </Row>
                        </TextButton>
                    )}
                    <SecondaryButton onClick={() => setShowRecentNotes(prev => !prev)}>
                        <IoSparkles size={12} />
                        {showRecentNotes ? <span className="text-label">Hide Recent</span> : <span className="text-label">View Recent</span>}
                    </SecondaryButton>
                </Row>
                </Header>
            {showTree ? (
                <TreeView showTree={showTree} />
            ) : searchResults.length > 0 ? (
                <>
                <h1>Search Results</h1>
                <ElevatedContainer width='100%' padding='lg'>
                    <Grid columns={1} $layoutMode='list'>
                        {searchResults.map((note) => (
                            <NoteCard key={note.id}>
                            <NoteContent>
                                <ReactMarkdown
                                    components={{
                                    ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
                                    li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
                                    }}
                                >
                                    {note.content}
                                </ReactMarkdown>
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
                    {isLoading || isNoteLoading ? <LoadingSpinner/> : (
                        <>  
                            {isSummaryVisible ? 
                                <Summary/>
                             : null}
                            {showRecentNotes ? 
                                <>
                                    <NotesRow/>
                                    {/* Fix later */}
                                    <Spacer height='lg'/>
                                    <Spacer height='sm'/>
                                </>
                             : null}
                            {currentCategory ? (
                                <NotesList category={currentCategory} />
                            ) : (
                                <>
                                    { categories.length > 0 ? (
                                        <>
                                            <h1>My Notepads</h1>
                                            
                                        </>
                                    ) : (
                                        <h1>Welcome to SparkPad!</h1>
                                    )}
                                    <NoteCategories handleCategoryClick={handleCategoryClick} />
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            {isSettingsVisible && (
                <Modal
                    isOpen={true}
                    onClose={() => setIsSettingsVisible(false)}
                    title="Settings"
                >
                <ThemeToggle />
                <SecondaryButton onClick={handleCalendarClick}>
                    <MdEventAvailable size={20}/>
                    Sync Google
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