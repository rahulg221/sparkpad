import { useEffect, useState } from 'react';
import { NoteService } from '../../../api/noteService';
import { useAuth } from '../../../context/AuthProvider';
import { CategoriesContainer, CategoryBox, CategoryTitle, NoteCategoriesContainer, PenIcon, PenIconContainer, ScratchpadBox, ThumbsIconContainer } from './NoteCategories.Styles';
import { useActions } from '../../../context/ActionsContext';
import { Stack, Row, Column, Spacer } from '../../../styles/shared/BaseLayout';
import { IoPencilOutline, IoSparkles } from 'react-icons/io5';
import { useNotes } from '../../../context/NotesProvider';
import { UserService } from '../../../api/userService';
import { FaThumbsDown, FaThumbsUp, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaHome } from 'react-icons/fa';
import { LoadingSpinner } from '../../../styles/shared/LoadingSpinner';
import { Note } from '../../../models/noteModel';
import { FaArrowCircleDown, FaPlus } from 'react-icons/fa';
import { IconButton } from '../../../styles/shared/Button.styles';
import { NewNotepadModal } from '../../modal/NewNotepadModal';
import { FaHouse } from 'react-icons/fa6';

export const NoteCategories = () => {
  const { user, lockedCategories, setLockedCategories } = useAuth();
  const { categories, setCategories, setIsSidebarVisible, isToolBarCollapsed, isSidebarVisible, isInputBarVisible, setIsInputBarVisible, setNotificationMessage, setShowNotification } = useActions();
  const { draftNote, setDraftNote, setWriteInCurrentCategory, isCategoriesLoading, isSearchLoading, setCurrentCategory, refreshNotes, setRefreshNotes, setShowRecentNotes, showRecentNotes } = useNotes();
  const [isNewNotepadVisible, setIsNewNotepadVisible] = useState(false);
  const iconSize = window.innerWidth < 768 ? 22 : 16;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      try {
        let categories = await NoteService.getDistinctCategories(user.id);

        setCategories(categories);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } 
    };

    fetchCategories();
  }, [user?.id, isCategoriesLoading, lockedCategories]);

  useEffect(() => {
    // Make sure Scratchpad is always present
    showEmptySparkpad('Unsorted');
  }, [categories]);

  const showEmptySparkpad = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  }
  
  const handleNewNotepad = async (newCategory: string) => {
    let notificationMessage = '';
    let categories = [];

    try {
        showEmptySparkpad(newCategory);
        await UserService.updateLockedCategory(user?.id || '', newCategory, lockedCategories);

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

  const handlePenClick = (category: string) => {
    if (category === 'Unsorted') {
      setIsInputBarVisible(true);
    } else {
      setWriteInCurrentCategory(true);
      setDraftNote('');
    }
  }

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
  };

  const handleNotepadClick = () => {
    setWriteInCurrentCategory(true);
  }

  const handleRemoveSuggestedCategory = async (category: string) => {
    if (!user?.id) return;
    await NoteService.removeSuggestedCategory(user.id, category);
    setCategories(categories.filter((c: string) => c !== category));
    setNotificationMessage('Suggested sparkpad rejected');
    setShowNotification(true);
    setRefreshNotes(!refreshNotes);
  }

  const handleUpdateLockedCategory = async (category: string) => {
    if (!user?.id) return;
    await UserService.updateLockedCategory(user.id, category, lockedCategories);
    setLockedCategories(lockedCategories.includes(category) ? lockedCategories.filter((c: string) => c !== category) : [...lockedCategories, category]);
  }   

  return (
    <NoteCategoriesContainer>
      <Column main="start" cross="start">
        <Row main="spaceBetween" cross="start" gap="sm">
          <h1>Workspace</h1>
          <IconButton title="Create a new Sparkpad" onClick={() => setIsNewNotepadVisible(true)}>
            <FaPlus size={14} />
          </IconButton>
        </Row>
      <Spacer height="lg" />
      <CategoriesContainer isToolBarCollapsed={isToolBarCollapsed} isSidebarVisible={isSidebarVisible}>
            {categories.length === 0 ? (
              <h2>Click + to create a new sparkpad or begin writing and view your loose sparks in the sparkboard.</h2>
            ) : (
              <>
            {isCategoriesLoading ? (
              <LoadingSpinner />
            ) : (
              <>
              {categories.sort((a, b) => {
                if (a === 'Unsorted') return -1;
                if (b === 'Unsorted') return 1;
              
                const aLocked = lockedCategories.includes(a);
                const bLocked = lockedCategories.includes(b);
              
                if (aLocked === bLocked) return 0;
                return aLocked ? -1 : 1;
              }).map((category) => (
                <Row main="start" cross="center" key={category} gap="md">
                  <Stack onClick={() => handleCategoryClick(category)}>
                    {category === "Unsorted" ? (
                      <ScratchpadBox onClick={() => handleNotepadClick()} />
                    ) : (
                      <CategoryBox onClick={() => handleNotepadClick()} isPermanent={lockedCategories.includes(category)} />
                    )}
                    {lockedCategories.includes(category) || category === "Unsorted" ? (
                      <PenIconContainer isPermanent={true}>
                        <PenIcon title={`Write in ${category}`} onClick={() => handlePenClick(category)}>
                          <IoPencilOutline size={25} />
                        </PenIcon>
                      </PenIconContainer>
                    ) : (
                      <PenIconContainer isPermanent={false}>
                        <PenIcon title={`Suggested sparkpad`}>
                          <IoSparkles size={14} />
                        </PenIcon>
                      </PenIconContainer>
                    )}
                  </Stack>
                  {category === "Unsorted" ? (
                    <CategoryTitle isPermanent={true}>
                      <h1 onClick={() => handleCategoryClick("Unsorted")}>Sticky Notes</h1>
                    </CategoryTitle>
                  ) : (
                    <> 
                      {lockedCategories.includes(category) ?   (
                          <CategoryTitle isPermanent={true}>
                            <h1 onClick={() => handleCategoryClick(category)}>{category}</h1>
                            <ThumbsIconContainer isPermanent={false} title="Downgrade a sparkpad into a suggested sparkpad">
                              <FaTimesCircle size={12} className="reject" onClick={() => handleUpdateLockedCategory(category)}/>
                            </ThumbsIconContainer>
                          </CategoryTitle>
                        ) : (
                          <CategoryTitle isPermanent={false}>
                            <h1 onClick={() => handleCategoryClick(category)}>{category}</h1>
                            <ThumbsIconContainer isPermanent={false} title="Upgrade a suggested sparkpad into a sparkpad or reject it">
                              <FaCheckCircle size={12} className="accept" onClick={() => handleUpdateLockedCategory(category)}/>
                              <FaTimesCircle size={12} className="reject" onClick={() => handleRemoveSuggestedCategory(category)} />
                            </ThumbsIconContainer>
                          </CategoryTitle>
                        )}
                    </>
                  )}
                </Row>  
              ))}
              </>
            )}
            </>
          )}
      </CategoriesContainer>    
      {isNewNotepadVisible && (
          <NewNotepadModal
              isOpen={isNewNotepadVisible}
              onClose={() => setIsNewNotepadVisible(false)}
              onSave={(newCategory: string) => handleNewNotepad(newCategory)}
          />
      )}
    </Column> 
    </NoteCategoriesContainer>
  );
};
