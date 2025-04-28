import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { 
    DashboardWrapper,
} from './Dashboard.Styles';
import { SecondaryButton, TextButton } from '../../styles/shared/Button.styles';
import { NoteCategories } from '../categories/NoteCategories';
import { NotesList } from '../noteslist/NotesList';
import { NoteService } from '../../api/noteService';
import { Notification } from '../notif/Notification';
import { Modal } from '../modal/Modal';
import { useActions } from '../../context/ActionsContext';
import { MdEventAvailable, MdLogout } from 'react-icons/md';
import CalendarService from '../../api/calendarService';
import { ThemeToggle } from '../themetoggle/ThemeToggle';
import { NotesRow } from '../notesrow/NotesRow';
import { Grid, Spacer, Row } from '../../styles/shared/BaseLayout';
import { MdArrowBack } from 'react-icons/md';
import { TreeView } from '../tree/Tree';
import ReactMarkdown from 'react-markdown';
import { useSummary } from '../../context/SummaryProvider';
import { useNotes } from '../../context/NotesProvider';
import { FaPen, FaTrash } from 'react-icons/fa';
import { NoteCard, NoteContent, NoteInfo, SmallIconButton } from '../noteslist/NotesList.Styles';
import { Note } from '../../models/noteModel';
import { UpdateNoteModal } from '../modal/UpdateNoteModal';
import { NewNotepadModal } from '../modal/NewNotepadModal';
import { UserService } from '../../api/userService';
import { InputBar } from '../inputbar/InputBar';
import { SortingUpdatesModal } from '../modal/SortingUpdates';

export const Dashboard = () => {
    const { signOut, isGoogleConnected, setIsGoogleConnected, lockedCategories, setLockedCategories, user } = useAuth();
    const { setIsSettingsVisible, setCategories, setNotificationMessage, isSettingsVisible, setShowNotification, notificationMessage, categories, showNotification, notificationType, isInputBarVisible, setIsInputBarVisible, } = useActions();
    const { setIsSummaryVisible } = useSummary();
    const [isUpdateNoteOpen, setIsUpdateNoteOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [noteToUpdate, setNoteToUpdate] = useState<Note | null>(null);
    const [isNewNotepadVisible, setIsNewNotepadVisible] = useState(false);
    const { currentCategory, 
            showTree, 
            showRecentNotes, 
            searchResults,
            setCurrentCategory, 
            setShowTree, 
            setSearchResults,
            setWriteInCurrentCategory,
            isSortingUpdatesVisible,
            sortingUpdates, 
            clusteredUpdates,
            rollbackNotes,
            setIsSortingUpdatesVisible,
            setIsCategoriesLoading,
    } = useNotes();

    const navigate = useNavigate();

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

    const handleNewNotepad = async (newCategory: string) => {
        let notificationMessage = '';
        let categories = [];

        const anchorNote: Note = {
          content: 'Custom Sparkpad created!\n- This sparkpad is locked by default, click the lock icon to unlock it.\n- Click the pen icon to write in this sparkpad.',
          user_id: user?.id || '',
          category: newCategory,
          cluster: -1,
        };

        try {
            await NoteService.addNote(anchorNote);
            await UserService.updateLockedCategory(user?.id || '', newCategory);

            notificationMessage = 'Custom sparkpad created!';
        
            categories = await NoteService.getDistinctCategories(user?.id || '');
            setCategories(categories);
            setLockedCategories([...lockedCategories, newCategory]);
            setNotificationMessage(notificationMessage);
            setShowNotification(true);
            setIsNewNotepadVisible(false);
        } catch (err) {
            notificationMessage = 'Error creating new sparkpad';
            setNotificationMessage(notificationMessage);
            setShowNotification(true);
            setIsNewNotepadVisible(false);
            console.error('Error creating new sparkpad:', err);
        }
    }

    const handleLogout = async () => {{}
        try {
            handleBackClick();
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
        setIsSummaryVisible(false);
        setShowTree(false);
        setWriteInCurrentCategory(false);
        setIsInputBarVisible(false);    
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
          await NoteService.deleteNote(noteId, user?.id || '');
          setSearchResults(searchResults.filter(note => note.id !== noteId));
        } catch (err) {
          console.error('Error deleting note:', err);
        }
    };

    const handleUpdateNote = async (noteId: string) => {
        try {
          await NoteService.updateNote(noteId, newCategory);
          setIsUpdateNoteOpen(false);
        } catch (err) {
          console.error('Error updating note:', err);
        }
    }

    const handleCalendarClick = async () => {
        try {
            const googleAuthUrl = await CalendarService.getGoogleAuthUrl();
            window.location.href = googleAuthUrl; 
        } catch (err) {
            console.error("Failed to get Google auth URL", err);
        }
    };

    const handleRevertChanges = async () => {
        try {
            setIsCategoriesLoading(true);
            await NoteService.revertChanges(rollbackNotes);
            console.log('Reverted changes');
            setIsSortingUpdatesVisible(false);
            console.log('Sorting updates visible set to false');
            setIsCategoriesLoading(false);
            console.log('Categories loading set to false');
        } catch (err) {
            console.error('Error reverting changes:', err);
        }
    }

    const renderDashboardContent = () => {
        // Tree View overrides everything
        if (showTree) {
          return <TreeView showTree={showTree} />;
        }
    
        if (searchResults.length > 0) {
          return (
            <>
              <h1>Search Results</h1>
                <Grid $columns={1} $layoutMode="list">
                  {searchResults.map((note) => (
                    <NoteCard key={note.id} $layoutMode="list">
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
                        {note.category === "Unsorted"
                          ? "Miscellaneous"
                          : note.category.replace(/\*\*/g, "").split(" ").slice(0, 2).join(" ")}
                        <br />
                        {new Date(note.created_at!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        <Spacer expand={true} />
                        <SmallIconButton onClick={() => {
                            setNoteToUpdate(note);
                            setIsUpdateNoteOpen(true);
                        }}>
                        <FaPen size={14} />
                        </SmallIconButton>
                        <Spacer width='sm' />
                        <SmallIconButton onClick={() => handleDeleteNote(note.id!)}>
                        <FaTrash size={14} />
                        </SmallIconButton>
                      </NoteInfo>
                    </NoteCard>
                  ))}
                </Grid>
            </>
          );
        }
        // Default dashboard view
        return (
          <>
            <Spacer height="xl" />

            {showRecentNotes && (
              <>
                <NotesRow />
              </>
            )}
      
            {currentCategory ? (
              <>
                
                <NotesList category={currentCategory} />
              </>
            ) : (
              <>
                
                <NoteCategories handleCategoryClick={handleCategoryClick} setIsNewNotepadVisible={setIsNewNotepadVisible} />
              </>
            )}
          </>
        );
      };
      

    return (
        <DashboardWrapper>
            {(showTree || currentCategory || searchResults.length > 0) && (
              <TextButton onClick={handleBackClick}>
                  <Row main="start" cross="center">
                      <MdArrowBack size={14} />
                      <Spacer width='sm'/>
                      Back
                  </Row>
              </TextButton>
            )}
            {renderDashboardContent()}
            <InputBar />
            {isSortingUpdatesVisible && (
                <SortingUpdatesModal
                    isOpen={isSortingUpdatesVisible}
                    onClose={() => handleRevertChanges()}
                    sortingUpdates={sortingUpdates}
                    clusteredUpdates={clusteredUpdates}
                    onSave={() => setIsSortingUpdatesVisible(false)} // Fix later to save/revert changes
                />
            )}
            {isUpdateNoteOpen && (
                <UpdateNoteModal
                    isOpen={isUpdateNoteOpen}
                    onClose={() => setIsUpdateNoteOpen(false)}
                    onSave={() => handleUpdateNote(noteToUpdate!.id!)}
                    noteContent={noteToUpdate?.content || ''}   
                    newCategory={newCategory}
                    setNewCategory={setNewCategory}
                    categories={categories}
                />
            )}
            {isSettingsVisible && (
                <Modal
                    isOpen={true}
                    onSave={() => setIsSettingsVisible(false)}
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
            {isNewNotepadVisible && (
                <NewNotepadModal
                    isOpen={isNewNotepadVisible}
                    onClose={() => setIsNewNotepadVisible(false)}
                    onSave={(newCategory: string) => handleNewNotepad(newCategory)}
                />
            )}
            {showNotification && (
                <Notification 
                    message={notificationMessage} 
                    onClose={() => setShowNotification(false)}
                    type={notificationType}
                />
            )}
        </DashboardWrapper>
    );
};