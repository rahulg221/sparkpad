import { useEffect, useState } from 'react';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthContext';
import { CategoriesContainer, CategoryBox, CategoryTitle } from './NoteCategories.Styles';
import { useActions } from '../../context/ActionsContext';
import { Column, ElevatedContainer, Row } from '../../styles/shared/BaseLayout';
import { FaLightbulb, FaPlus, FaWandSparkles } from 'react-icons/fa6';
import { FaCalendar, FaCheckCircle, FaSearch } from 'react-icons/fa';

interface NoteCategoriesProps {
  handleCategoryClick: (category: string) => void;
}

export const NoteCategories = ({ handleCategoryClick }: NoteCategoriesProps) => {
  const { user } = useAuth();
  const { categories, setCategories } = useActions();
  const { setCurrentNotes } = useActions();
  const iconSize = window.innerWidth < 768 ? 22 : 16;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      try {
        const categories = await NoteService.getDistinctCategories(user.id);
        setCategories(categories);

        const notes = await NoteService.getNotes(user.id, 50);
        setCurrentNotes(notes);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } 
    };

    fetchCategories();
  }, [user?.id]);

  return (
    <ElevatedContainer padding='md'>
      { categories.length === 0 ? (
        <Column main='start' cross='start' gap='lg' padding='lg'>
          <Row main='start' cross='start' gap='md'>
            <FaPlus size={iconSize} /> 
            <h2>Use the side bar to create your first note and access tasks, events, and summaries.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaCalendar size={iconSize} /> 
            <h2>Start your note with /e to create a new calendar event with natural language.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaCheckCircle size={iconSize} /> 
            <h2>Start your note with /t to create a new calendar task with natural language.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaWandSparkles size={iconSize} /> 
            <h2>Click Organize after adding at least 15 notes to group them into notepads.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaLightbulb size={iconSize} /> 
            <h2>Click Summarize to get insights from your last 50 notes.</h2>
          </Row>
          <Row main='start' cross='start' gap='md'>
            <FaSearch size={iconSize} /> 
            <h2>Click Search to find notes by meaning.</h2>
          </Row>
        </Column>
      ) : (
        <CategoriesContainer>
          {categories.map((category) => (
            <div key={category}>
            <CategoryBox onClick={() => handleCategoryClick(category)} />
              {category === "Unsorted" ? (
                <h2>Miscellaneous</h2>
              ) : (
                <CategoryTitle>
                  {category.replace(/\*\*/g, "").split(" ").slice(0, 3).join(" ")}
                </CategoryTitle>
              )}
          </div>
        ))}
        </CategoriesContainer>
      )}
    </ElevatedContainer>
  );
};
