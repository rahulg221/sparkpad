import { useEffect, useState } from 'react';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/authContext';
import { CategoriesContainer, CategoryBox, CategoryName } from './NoteCategories.Styles';
import { useActions } from '../../context/ActionsContext';

interface NoteCategoriesProps {
  handleCategoryClick: (category: string) => void;
}

export const NoteCategories = ({ handleCategoryClick }: NoteCategoriesProps) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const { setCurrentNotes } = useActions();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      try {
        const categories = await NoteService.getDistinctCategories(user.id);
        setCategories(categories);

        const notes = await NoteService.getDailyNotes(user.id);
        setCurrentNotes(notes);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } 
    };

    fetchCategories();
  }, [user?.id]);

  const getCategoryCount = async (category: string) => {
    if (!user?.id) return 0;
    return await NoteService.getNotesCountByCategory(user.id, category);
  };

  return (
    <><CategoriesContainer>
          {categories.map((category) => (
            <div>
              <CategoryBox
                  key={category}
                  onClick={() => handleCategoryClick(category)}
              >
                  
              </CategoryBox>
              <CategoryName>{category}</CategoryName>
            </div>
          ))}
      </CategoriesContainer></>
  );
};
