import { useEffect } from 'react';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthProvider';
import { CategoriesContainer, CategoryBox, CategoryTitle, IconContainer } from './NoteCategories.Styles';
import { useActions } from '../../context/ActionsContext';
import { Column, Row, Stack } from '../../styles/shared/BaseLayout';
import { FaLightbulb, FaPlus, FaWandSparkles } from 'react-icons/fa6';
import { FaCalendar } from 'react-icons/fa';
import { IoPencilOutline } from 'react-icons/io5';
import { useNotes } from '../../context/NotesProvider';
import { LoadingSpinner } from '../../styles/shared/LoadingSpinner';
import { Container } from '../../styles/shared/BaseLayout';

interface NoteCategoriesProps {
  handleCategoryClick: (category: string) => void;
}

export const NoteCategories = ({ handleCategoryClick }: NoteCategoriesProps) => {
  const { user } = useAuth();
  const { categories, setCategories, setIsInputVisible, isToolBarCollapsed, isInputVisible } = useActions();
  const { setWriteInCurrentCategory, isCategoriesLoading } = useNotes();
  const iconSize = window.innerWidth < 768 ? 22 : 16;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      try {
        const categories = await NoteService.getDistinctCategories(user.id);
        setCategories(categories);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } 
    };

    fetchCategories();
  }, [user?.id]);

  const handlePenClick = () => {
    setIsInputVisible(true);
    setWriteInCurrentCategory(true);
  }

  return (
    <>
      { categories.length === 0 ? (
        <Column main='start' cross='start' gap='lg' padding='lg'>
          <Row main='start' cross='start' gap='md'>
            <FaPlus size={iconSize} /> 
            <h2>Use the side bar to create your first note and view tasks, events, and summaries.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaCalendar size={iconSize} /> 
            <h2>Start your note with /e or /t to create a new calendar event or task with natural language.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaWandSparkles size={iconSize} /> 
            <h2>Click Organize after adding at least 15 notes to automatically organize them into notepads.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaLightbulb size={iconSize} /> 
            <h2>Click Summarize to get insights from your last 50 notes.</h2>
          </Row>
        </Column>
      ) : (
        <CategoriesContainer isToolBarCollapsed={isToolBarCollapsed} isInputVisible={isInputVisible}>
          {isCategoriesLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {categories.map((category) => (
                <div key={category}>
              <Stack onClick={() => handleCategoryClick(category)}>
                  <CategoryBox></CategoryBox>
                  <IconContainer onClick={handlePenClick}>
                    <IoPencilOutline size={50} />
                  </IconContainer>
              </Stack>
              {category === "Unsorted" ? (
                <h2>Miscellaneous</h2>
              ) : (
                <CategoryTitle>
                  {category}
                </CategoryTitle>
                )}
              </div>
            ))}
            </>
          )}
        </CategoriesContainer>
      )}
    </>
  );
};
