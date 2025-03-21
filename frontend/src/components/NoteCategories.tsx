import styled from 'styled-components';
import { getNotes, groupAndLabelNotes } from '../api/noteMethods';
import { useAuth } from '../context/AuthContext';

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryBox = styled.div`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const CategoryName = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
`;

interface NoteCategoriesProps {
  handleCategoryClick: (category: string) => void;
}

export const NoteCategories = ({ handleCategoryClick }: NoteCategoriesProps) => {
  const categories = ['-1', '1', '2', '3', '4', '5', '6'];
  const { user } = useAuth();

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
