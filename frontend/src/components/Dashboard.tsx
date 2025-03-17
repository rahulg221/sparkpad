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
} from '../styles/DashboardStyles';

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
                <button onClick={handleLogout}>Logout</button>
            </Header>

            <FAB onClick={() => setIsModalOpen(true)}>✐</FAB>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Create New Note</h2>
                <NoteInput
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your note here..."
                    autoFocus
                />
                <SubmitButton
                    onClick={handleCreateNote}
                    disabled={!noteContent.trim()}
                >
                    Create Note
                </SubmitButton>
            </Modal>
        </DashboardWrapper>
    );
};