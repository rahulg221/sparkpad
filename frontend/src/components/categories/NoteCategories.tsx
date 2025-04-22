import { useEffect } from 'react';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthProvider';
import { CategoriesContainer, CategoryBox, CategoryTitle, PenIcon, PenIconContainer, LockIconContainer } from './NoteCategories.Styles';
import { useActions } from '../../context/ActionsContext';
import { Stack, Row } from '../../styles/shared/BaseLayout';
import { IoPencilOutline, IoLockClosedOutline } from 'react-icons/io5';
import { useNotes } from '../../context/NotesProvider';
import { UserService } from '../../api/userService';
import { FaLockOpen } from 'react-icons/fa6';
import { FaLock } from 'react-icons/fa';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { Note } from '../../models/noteModel';

interface NoteCategoriesProps {
  handleCategoryClick: (category: string) => void;
}

export const NoteCategories = ({ handleCategoryClick }: NoteCategoriesProps) => {
  const { user, lockedCategories, setLockedCategories } = useAuth();
  const { categories, setCategories, setIsInputVisible, isToolBarCollapsed, isInputVisible } = useActions();
  const { setWriteInCurrentCategory, isCategoriesLoading, isSearchLoading } = useNotes();
  const iconSize = window.innerWidth < 768 ? 22 : 16;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      try {
        let categories = await NoteService.getDistinctCategories(user.id);

        if (categories.length === 0) {
          const welcomeNote: Note = {
            content: 'Welcome to Sparkpad! Here are a few tips to get you started:\n\n- Use the Capture tool to capture at least 15 sparks\n\n- Use the Organize tool to auto-organize them into sparkpads\n\n- Sync your Google Calendar in Settings, then type / in the capture tool to view Google Calendar commands\n\n- Lock a sparkpad to prevent it from being auto-organized',
            user_id: user?.id || '',
            category: 'Unsorted',
            cluster: -1,
          };
          
          await NoteService.addNote(welcomeNote);

          categories = await NoteService.getDistinctCategories(user.id);
        }

        setCategories(categories);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } 
    };

    fetchCategories();
  }, [user?.id, isCategoriesLoading, lockedCategories]);

  const handlePenClick = () => {
    setIsInputVisible(true);
    setWriteInCurrentCategory(true);
  }

  const handleAddLockedCategory = async (category: string) => {
    if (!user?.id) return;
    await UserService.updateLockedCategory(user.id, category);
    setLockedCategories(lockedCategories.includes(category) ? lockedCategories.filter((c: string) => c !== category) : [...lockedCategories, category]);
  }   

  return (
    <>
      <CategoriesContainer isToolBarCollapsed={isToolBarCollapsed} isInputVisible={isInputVisible}>
            <>
            {isCategoriesLoading || isSearchLoading ? (
              <LoadingSpinner />
            ) : (
              <>
              {categories.map((category) => (
                <div key={category}>
                <Stack onClick={() => handleCategoryClick(category)}>
                    <CategoryBox></CategoryBox>
                    <PenIconContainer>
                      <PenIcon title={`Write in ${category}`} onClick={handlePenClick}>
                        <IoPencilOutline size={45} />
                      </PenIcon>
                    </PenIconContainer>
                </Stack>
                  {category === "Unsorted" ? (
                    <CategoryTitle>Miscellaneous</CategoryTitle>
                  ) : (
                    <CategoryTitle >
                        {category}
                        {lockedCategories.includes(category) ?   (
                          <LockIconContainer title="Unlock a category to allow it to be moved during organizing" onClick={() => handleAddLockedCategory(category)}>
                            <FaLock size={14} />
                          </LockIconContainer>
                        ) : (
                          <LockIconContainer title="Lock a category to prevent it from being moved during organizing" onClick={() => handleAddLockedCategory(category)}>
                            <FaLockOpen size={14} />
                          </LockIconContainer>
                        )}
                    </CategoryTitle>
                    )}
                </div>  
              ))}
              </>
            )}
            </>
      </CategoriesContainer>    
          
    </> 
  );
};
