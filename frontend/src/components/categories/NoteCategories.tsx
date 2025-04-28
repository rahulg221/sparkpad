import { useEffect } from 'react';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthProvider';
import { CategoriesContainer, CategoryBox, CategoryTitle, PenIcon, PenIconContainer, ThumbtackIconContainer } from './NoteCategories.Styles';
import { useActions } from '../../context/ActionsContext';
import { Stack, Row } from '../../styles/shared/BaseLayout';
import { IoPencilOutline } from 'react-icons/io5';
import { useNotes } from '../../context/NotesProvider';
import { UserService } from '../../api/userService';
import { FaThumbtack } from 'react-icons/fa6';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { Note } from '../../models/noteModel';
import { FaPlus } from 'react-icons/fa';
import { IconButton } from '../../styles/shared/Button.styles';

interface NoteCategoriesProps {
  handleCategoryClick: (category: string) => void;
  setIsNewNotepadVisible: (visible: boolean) => void;
}

export const NoteCategories = ({ handleCategoryClick, setIsNewNotepadVisible }: NoteCategoriesProps) => {
  const { user, lockedCategories, setLockedCategories } = useAuth();
  const { categories, setCategories, setIsInputVisible, isToolBarCollapsed, isInputVisible, isInputBarVisible, setIsInputBarVisible } = useActions();
  const { setWriteInCurrentCategory, isCategoriesLoading, isSearchLoading } = useNotes();
  const iconSize = window.innerWidth < 768 ? 22 : 16;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      try {
        let categories = await NoteService.getDistinctCategories(user.id);

        if (categories.length === 0 || !categories.includes('Unsorted')) {
          const welcomeNote: Note = {
            content: 'This is your default category for uncategorized notes.\n\n- Use + to create a new sparkpad.\n\n- If you become attached to a sparkpad, you can lock it to only allow notes to be added to it.\n\n- Use Organize to sort notes into locked sparkpads and generate new dynamic ones.\n\n- Notes in unlocked sparkpads or Miscellaneous can be moved to other unlocked sparkpads during organizing.',
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
    setIsInputBarVisible(true);
    setWriteInCurrentCategory(true);
  }

  const handleNotepadClick = () => {
    setWriteInCurrentCategory(true);
  }

  const handleUpdateLockedCategory = async (category: string) => {
    if (!user?.id) return;
    await UserService.updateLockedCategory(user.id, category);
    setLockedCategories(lockedCategories.includes(category) ? lockedCategories.filter((c: string) => c !== category) : [...lockedCategories, category]);
  }   

  return (
    <>
      <Row main="spaceBetween" cross="start">
        <h1>Sparkpads</h1>
        <IconButton title="Create a new Sparkpad" onClick={() => setIsNewNotepadVisible(true)}>
          <FaPlus size={14} />
        </IconButton>
      </Row>
      <CategoriesContainer isToolBarCollapsed={isToolBarCollapsed} isInputVisible={isInputVisible}>
            {isCategoriesLoading || isSearchLoading ? (
              <LoadingSpinner />
            ) : (
              <>
              {categories.sort((a, b) => {
                const aLocked = lockedCategories.includes(a);
                const bLocked = lockedCategories.includes(b);
                if (aLocked === bLocked) return 0;
                return aLocked ? -1 : 1;  // locked categories first
              }).map((category) => (
                <div key={category}>
                <Stack onClick={() => handleCategoryClick(category)}>
                    <CategoryBox onClick={() => handleNotepadClick()} />
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
                          <ThumbtackIconContainer pinned={true} title="Unpin a category to allow it to be moved during organizing" onClick={() => handleUpdateLockedCategory(category)}>
                            <FaThumbtack size={14}/>
                          </ThumbtackIconContainer>
                        ) : (
                          <ThumbtackIconContainer pinned={false} title="Pin a category to prevent it from being moved during organizing" onClick={() => handleUpdateLockedCategory(category)}>
                            <FaThumbtack size={14}/>
                          </ThumbtackIconContainer>
                        )}
                    </CategoryTitle>
                    )}
                </div>  
              ))}
              </>
            )}

      </CategoriesContainer>    

    </> 
  );
};
