import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from '../components/Modal';
import {
  DashboardWrapper,
  Header,
  FAB,
  NoteInput,
  SubmitButton
} from '../styles/components/DashboardStyles';
import { SecondaryButton } from '../styles/shared/Button.styles';
import { TextBar } from './TextBar';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteContent, setNoteContent] = useState('');

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleCreateNote = () => {
        console.log('Creating note:', noteContent);
        setNoteContent('');
        setIsModalOpen(false);
    };

    return (
        <DashboardWrapper>
            <Header>
                <h1>Dashboard</h1>
                <SecondaryButton width="10%" onClick={handleLogout}>Logout</SecondaryButton>
            </Header>

            <FAB onClick={() => setIsModalOpen(true)}>✐</FAB>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Jot down your thoughts</h2>
                <NoteInput
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="What's on your mind?"
                    autoFocus
                />
                <SubmitButton
                    onClick={handleCreateNote}
                    disabled={!noteContent.trim()}
                >
                    Send
                </SubmitButton>
            </Modal>
        </DashboardWrapper>
    );
};