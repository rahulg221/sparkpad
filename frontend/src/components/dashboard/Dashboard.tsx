import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animation from '../../assets/animation.json';

import {
    ButtonContainer, 
    DashboardWrapper,
    Header,
} from './Dashboard.Styles';
import { SecondaryButton } from '../../styles/shared/Button.styles';
import { NoteCategories } from '../categories/NoteCategories';
import { NotesList } from '../list/NotesList';
import { getNotes, groupAndLabelNotes, summarizeDailyNotes } from '../../api/noteMethods';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
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

    const handleClustering = async () => {
        try {
            const notes = await getNotes(user?.id || '');
            
            setIsLoading(true);
            await groupAndLabelNotes(notes);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error('Error testing clustering:', err);
        }
    };

    const handleSummarize = async () => {
        try {
            setIsLoading(true);
            const summary = await summarizeDailyNotes(user?.id || '');
            console.log(summary);
            setIsLoading(false);
        } catch (err) {
            console.error('Error summarizing daily notes:', err);
            setIsLoading(false);
        }
    };

    const Loader = () => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Lottie
            animationData={animation}
            loop
            autoplay
            style={{ width: 200, height: 200 }}
          />
        </div>
      );

    return (
        <DashboardWrapper>
            <Header>
                <h1>DriftPad</h1>
                <ButtonContainer>
                    <SecondaryButton onClick={handleSummarize}>Generate Daily Report</SecondaryButton>
                    <SecondaryButton onClick={handleClustering}>Auto-Organize</SecondaryButton>
                    <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>
                </ButtonContainer>
            </Header>
            <div>
            {isLoading ? <Loader /> :selectedCategory ? (
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