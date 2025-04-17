import { useState } from 'react';
import { Column, Container, Row, Spacer } from '../../styles/shared/BaseLayout';
import { FaChevronLeft, FaChevronRight, FaLightbulb, FaSearch, FaSignOutAlt} from 'react-icons/fa';
import { SecondaryButton } from '../../styles/shared/Button.styles';
import { IconWrapper, ToolBarContainer } from './ToolBar.Styles';
import { FaFolderTree, FaGear, FaWandMagicSparkles } from 'react-icons/fa6';
import { useActions } from '../../context/ActionsContext';
import { useSummary } from '../../context/SummaryProvider';
import { SearchBar } from '../searchbar/SearchBar';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../context/NotesProvider';
import { TbServerSpark } from 'react-icons/tb';

export const ToolBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { autoOrganizeNotes, setIsSettingsVisible } = useActions();
    const { createSummary, setIsSummaryVisible } = useSummary();
    const { showTree, semanticSearch, setShowTree } = useNotes();
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSummaryClick = () => {
        setIsSummaryVisible(prev => !prev);
        createSummary();
    };  

    const handleOrganizeClick = () => {
        autoOrganizeNotes();
    };

    const handleVisualizeClick = () => {
        if (showTree) {
            setShowTree(false);
        } else {
            setShowTree(true);
        }
    };

    const handleSettingsClick = () => {
        setIsSettingsVisible(true);
    };

    const handleSearch = (query: string) => {
        semanticSearch(query);
    };

    const handleLogoutClick = () => {
        signOut();
        navigate('/login');
    };
    
    return (
        <ToolBarContainer isCollapsed={isCollapsed}>
            <Column main="spaceBetween" cross="start">   
                <Container width="100%">
                    {!isCollapsed && <Row main="start" cross="center" gap="sm">
                        <IconWrapper>
                            <TbServerSpark size={20} />
                        </IconWrapper>
                        <h1 style={{ margin: 0, fontSize: '1.1rem'}}>Sparkpad</h1>
                        <Spacer expand={true}/>
                        <SecondaryButton onClick={() => setIsCollapsed(prev => !prev)} width="fit">
                            <FaChevronLeft size={14} />
                        </SecondaryButton>
                    </Row>}
                    {isCollapsed && <SecondaryButton onClick={() => setIsCollapsed(prev => !prev)}><FaChevronRight size={14} /></SecondaryButton>}
                    {isCollapsed ? <SecondaryButton onClick={() => setIsCollapsed(prev => !prev)}><FaSearch size={14} /></SecondaryButton> : <SearchBar onSearch={handleSearch} />}
                    <SecondaryButton onClick={handleOrganizeClick}>
                        <FaWandMagicSparkles size={14} />
                        {isCollapsed ? null : 'Organize'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleSummaryClick}>
                        <FaLightbulb size={14} />
                        {isCollapsed ? null : 'Summarize'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleVisualizeClick}>
                        <FaFolderTree size={14} />
                        {isCollapsed ? null : 'Visualize'}
                    </SecondaryButton>
                </Container>
                <Container width="100%">
                    <SecondaryButton onClick={handleSettingsClick}>
                        <FaGear size={14} />
                        {isCollapsed ? null : 'Settings'}
                    </SecondaryButton>
                </Container>
            </Column>
        </ToolBarContainer>
    )
}
