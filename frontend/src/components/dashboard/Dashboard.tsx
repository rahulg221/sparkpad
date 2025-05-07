import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { 
    DashboardWrapper,
} from './Dashboard.Styles';
import { SecondaryButton, TextButton } from '../../styles/shared/Button.styles';
import { NoteCategories } from './categories/NoteCategories';
import { NotesList } from './noteslist/NotesList';
import { NoteService } from '../../api/noteService';
import { Notification } from '../notif/Notification';
import { Modal } from '../modal/Modal';
import { useActions } from '../../context/ActionsContext';
import { MdEventAvailable, MdLogout } from 'react-icons/md';
import CalendarService from '../../api/calendarService';
import { ThemeToggle } from '../modal/themetoggle/ThemeToggle';
import { NotesRow } from './notesrow/NotesRow';
import { Grid, Spacer, Row, Column } from '../../styles/shared/BaseLayout';
import { MdArrowBack } from 'react-icons/md';
import { TreeView } from '../tree/Tree';
import ReactMarkdown from 'react-markdown';
import { useSummary } from '../../context/SummaryProvider';
import { useNotes } from '../../context/NotesProvider';
import { FaPen, FaTrash } from 'react-icons/fa';
import { SmallIconButton } from '../../styles/shared/Button.styles';
import { NoteCard, NoteInfo, NotePreview } from './noteslist/NotesList.Styles';
import { Note } from '../../models/noteModel';
import { UpdateNoteModal } from '../modal/UpdateNoteModal';
import { NewNotepadModal } from '../modal/NewNotepadModal';
import { UserService } from '../../api/userService';
import { InputBar } from '../inputbar/InputBar';
import { SortingUpdatesModal } from '../modal/SortingUpdates';
import { IconButton } from '../../styles/shared/Button.styles';
import { SettingsModal } from '../modal/SettingsModal';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
    const { signOut, lockedCategories, setLockedCategories, user, setUser } = useAuth();
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
            unlockedNotes,
            setIsSortingUpdatesVisible,
            setIsCategoriesLoading,
    } = useNotes();

    const navigate = useNavigate();

    useEffect(() => {
        const runOAuthCallback = async () => {
          if (user?.isGoogleConnected) return;

          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          const isCallback = window.location.pathname.includes("/auth/google/callback");
      
          if (!code || !isCallback) return;
      
          try {
            await CalendarService.sendAuthCodeToBackend(code);

            if (user) {
              setUser({...user, isGoogleConnected: true});
            }
    
            window.history.replaceState({}, document.title, "/dashboard");
          } catch (err) {
            console.error("OAuth failed", err);
          }
        };

        if (currentCategory === '') {
            setCurrentCategory('Unsorted');
        }

        runOAuthCallback();
    }, []);    

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const isTyping = ['INPUT', 'TEXTAREA'].includes(
          (e.target as HTMLElement).tagName
        );
    
        if (isTyping) return; // don't trigger while typing
    
        // Trigger on 'Q' (for "Quick note")
        if (e.key === 'q' || e.key === 'Q') {
          e.preventDefault(); 

          setIsInputBarVisible(true);
        }
      };
    
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);    
    
    const handleLogout = async () => {{}
        try {
            handleBackClick();
            await signOut();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
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
          await NoteService.deleteNote(noteId, user?.id || '', lockedCategories);
          setSearchResults(searchResults.filter(note => note.id !== noteId));
        } catch (err) {
          console.error('Error deleting note:', err);
        }
    };

    const handleUpdateNote = async (noteId: string, content: string) => {
        try {
          await NoteService.updateNote(noteId, content, newCategory);
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
            
            // Update each note to set recentlyMoved to false
            for (const note of unlockedNotes) {
              if (note.recentlyMoved) {
                note.recentlyMoved = false;
              }
            }
            await NoteService.revertChanges(unlockedNotes);
            console.log('Reverted changes');
            setIsSortingUpdatesVisible(false);
            console.log('Sorting updates visible set to false');
            setIsCategoriesLoading(false);
            console.log('Categories loading set to false');
        } catch (err) {
            console.error('Error reverting changes:', err);
        }
    }

    return (
        <DashboardWrapper>
          {searchResults.length > 0 && (
            <>
              <Row main="start" cross="start" gap="sm">
                <MdArrowBack size={18} onClick={handleBackClick} />
                <h1>
                  {currentCategory === 'Unsorted' ? 'Miscellaneous' : currentCategory}
                </h1>
              </Row>
              <Spacer height="lg" />
              <Grid $columns={1} $layoutMode="list">  
                  {searchResults.map((note) => (
                    <NoteCard key={note.id} $layoutMode="list" $isUnsorted={note.category === "Unsorted"} isDeleting={note.isDeleting || false}>
                      <NotePreview $layoutMode="list" $isUnsorted={note.category === "Unsorted"}>
                        <ReactMarkdown
                          components={{
                            ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
                            li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
                          }}
                        >
                          {note.content}
                        </ReactMarkdown>
                      </NotePreview>
                      <NoteInfo $isUnsorted={note.category === "Unsorted"}>
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
          )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory} // this triggers re-animation on category change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <NotesList 
              category={currentCategory}
              lockedCategories={lockedCategories}
            />
          </motion.div>
        </AnimatePresence>
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
                    onSave={() => handleUpdateNote(noteToUpdate!.id!, noteToUpdate!.content!)}
                    noteContent={noteToUpdate?.content || ''}   
                    newCategory={newCategory}
                    setNewCategory={setNewCategory}
                    categories={categories}
                />
            )}
            {isSettingsVisible && (
                <SettingsModal
                    isOpen={isSettingsVisible}
                    onSave={() => setIsSettingsVisible(false)}
                    onClose={() => setIsSettingsVisible(false)}
                    handleCalendarClick={handleCalendarClick}
                    handleLogout={handleLogout}
                    setIsSettingsVisible={setIsSettingsVisible}
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