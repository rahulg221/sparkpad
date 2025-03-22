import { useEffect, useState } from 'react';
import { getDistinctCategories, getNotesByCluster } from '../../api/noteMethods';
import { useAuth } from '../../context/AuthContext';
import { CategoriesContainer, CategoryBox, CategoryName } from './NoteCategories.Styles';

interface NoteCategoriesProps {
  handleCategoryClick: (category: string) => void;
}

export const NoteCategories = ({ handleCategoryClick }: NoteCategoriesProps) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.id) return;

      try {
        const categories = await getDistinctCategories(user.id);
        setCategories(categories);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } 
    };

    fetchCategories();
  }, [user?.id]);

  return (
    <><CategoriesContainer>
          {categories.map((category) => (
              <CategoryBox
                  key={category}
                  onClick={() => handleCategoryClick(category)}
              >
                  <CategoryName>{category}</CategoryName>
              </CategoryBox>
          ))}
      </CategoriesContainer></>
  );
};
