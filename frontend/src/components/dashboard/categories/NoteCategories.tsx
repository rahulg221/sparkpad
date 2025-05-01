import { useEffect, useState } from 'react';
import { NoteService } from '../../../api/noteService';
import { useAuth } from '../../../context/AuthProvider';
import { CategoriesContainer, CategoryBox, CategoryTitle, NoteCategoriesContainer, PenIcon, PenIconContainer, ThumbtackIconContainer } from './NoteCategories.Styles';
import { useActions } from '../../../context/ActionsContext';
import { Stack, Row, Column, Spacer } from '../../../styles/shared/BaseLayout';
import { IoPencilOutline, IoSparkles } from 'react-icons/io5';
import { useNotes } from '../../../context/NotesProvider';
import { UserService } from '../../../api/userService';
import { FaArrowDown, FaArrowUp, FaCheck, FaCircle, FaCircleDot, FaCircleDown, FaCircleUp, FaFire, FaLightbulb, FaLock, FaLockOpen, FaRegCircle, FaRegStar, FaStar, FaThumbtack} from 'react-icons/fa6';
import { FaCheckCircle, FaUndo } from 'react-icons/fa';
import { LoadingSpinner } from '../../../styles/shared/LoadingSpinner';
import { Note } from '../../../models/noteModel';
import { FaPlus } from 'react-icons/fa';
import { IconButton, SecondaryButton, TextButton } from '../../../styles/shared/Button.styles';
import { InputBar } from '../../inputbar/InputBar';
import { NewNotepadModal } from '../../modal/NewNotepadModal';

export const NoteCategories = () => {
  const { user, lockedCategories, setLockedCategories } = useAuth();
  const { categories, setCategories, setIsSidebarVisible, isToolBarCollapsed, isSidebarVisible, isInputBarVisible, setIsInputBarVisible, setNotificationMessage, setShowNotification } = useActions();
  const { setWriteInCurrentCategory, isCategoriesLoading, isSearchLoading, setCurrentCategory } = useNotes();
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

  const handlePenClick = () => {
    setIsInputBarVisible(true);
    setWriteInCurrentCategory(true);
  }

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
  };

  const handleNotepadClick = () => {
    setWriteInCurrentCategory(true);
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
          <h1>Sparkpads</h1>
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
                const aLocked = lockedCategories.includes(a);
                const bLocked = lockedCategories.includes(b);
                if (aLocked === bLocked) return 0;
                return aLocked ? -1 : 1;  // locked categories first
              }).map((category) => (
                <Row main="start" cross="center" key={category} gap="md">
                <Stack onClick={() => handleCategoryClick(category)}>
                  <CategoryBox onClick={() => handleNotepadClick()} isPermanent={lockedCategories.includes(category) && category !== "Unsorted"} />
                  {lockedCategories.includes(category) && category !== "Unsorted" ? (
                    <PenIconContainer isPermanent={true}>
                      <PenIcon title={`Write in ${category}`} onClick={handlePenClick}>
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
                    <CategoryTitle isPermanent={false}>
                      <h1 onClick={() => handleCategoryClick("Unsorted")}>Miscellaneous</h1>
                    </CategoryTitle>
                  ) : (
                    <> 
                      {lockedCategories.includes(category) ?   (
                          <CategoryTitle isPermanent={true}>
                            <h1 onClick={() => handleCategoryClick(category)}>{category}</h1>
                            <ThumbtackIconContainer isPermanent={true} title="Downgrade a sparkpad into a suggested sparkpad" onClick={() => handleUpdateLockedCategory(category)}>
                              <FaCheckCircle size={12}/>
                            </ThumbtackIconContainer>
                          </CategoryTitle>
                        ) : (
                          <CategoryTitle isPermanent={false}>
                            <h1 onClick={() => handleCategoryClick(category)}>{category}</h1>
                            <ThumbtackIconContainer isPermanent={false} title="Upgrade a suggested sparkpad into a sparkpad" onClick={() => handleUpdateLockedCategory(category)}>
                              <FaRegCircle size={12}/>
                            </ThumbtackIconContainer>
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
