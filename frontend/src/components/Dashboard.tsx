import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    ButtonContainer,
  DashboardWrapper,
  Header,
} from '../styles/components/dashboard/DashboardStyles';
import { SecondaryButton } from '../styles/shared/Button.styles';
import { NoteCategories } from './NoteCategories';
import { NotesList } from './NotesList';
import { getNotes, groupAndLabelNotes } from '../api/noteMethods';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const handleBackClick = () => {
        setSelectedCategory(null);
    };

    const handleTestClustering = async () => {
        try {
          const notes = await getNotes(user?.id || '');
    
          await groupAndLabelNotes(notes);
        } catch (err) {
          console.error('Error testing clustering:', err);
        }
    };

    return (
        <DashboardWrapper>
            <Header>
                <h1>Dashboard</h1>
                <ButtonContainer>
                    <SecondaryButton width="10%" onClick={handleTestClustering}>Sort Notes</SecondaryButton>
                    <SecondaryButton width="10%" onClick={handleLogout}>Logout</SecondaryButton>
                </ButtonContainer>
            </Header>
            <div>
                {selectedCategory ? (
                    <NotesList 
                        category={selectedCategory}
                        onBackClick={handleBackClick}
                    />
                ) : (
                    <NoteCategories handleCategoryClick={handleCategoryClick} />
                )}
            </div>
        </DashboardWrapper>
    );
};