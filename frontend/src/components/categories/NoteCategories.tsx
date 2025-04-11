import { useEffect, useState } from 'react';
import { NoteService } from '../../api/noteService';
import { useAuth } from '../../context/AuthContext';
import { CategoriesContainer, CategoryBox } from './NoteCategories.Styles';
import { useActions } from '../../context/ActionsContext';
import { ElevatedContainer } from '../../styles/shared/BaseLayout';

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
      <CategoriesContainer>
        {categories.map((category) => (
          <div key={category}>
            <CategoryBox onClick={() => handleCategoryClick(category)} />
              {category === "Unsorted" ? (
                <h2>Miscellaneous</h2>
              ) : (
                <h2>
                  {category.replace(/\*\*/g, "").split(" ").slice(0, 3).join(" ")}
                </h2>
              )}
          </div>
        ))}
      </CategoriesContainer>
    </ElevatedContainer>
  );
};
