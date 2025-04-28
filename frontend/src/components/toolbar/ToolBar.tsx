import { Column, Container, Row, Spacer } from '../../styles/shared/BaseLayout';
import { FaChevronLeft, FaChevronRight, FaLightbulb, FaSearch, FaCalendar, FaThumbtack} from 'react-icons/fa';
import { SecondaryButton, IconButton } from '../../styles/shared/Button.styles';
import { IconWrapper, ToolBarContainer, SmallHeader } from './ToolBar.Styles';
import { FaClock, FaGear, FaPen, FaPlus, FaWandMagicSparkles } from 'react-icons/fa6';
import { useActions } from '../../context/ActionsContext';
import { useSummary } from '../../context/SummaryProvider';
import { SearchBar } from '../searchbar/SearchBar';
import { useNotes } from '../../context/NotesProvider';
import { TbFileTextSpark } from 'react-icons/tb';

export const ToolBar = () => {
    const { setIsSettingsVisible, setIsInputVisible, setIsToolBarCollapsed, isToolBarCollapsed, setIsEventsVisible, isEventsVisible, setIsTasksVisible, isTasksVisible, isInputVisible, setIsInputBarVisible, isInputBarVisible  } = useActions();
    const { createSummary, isSummaryVisible, setIsSummaryVisible } = useSummary();
    const { showTree, autoOrganizeNotes, semanticSearch, setShowTree, setShowRecentNotes, showRecentNotes } = useNotes();

    const handleSummaryClick = () => {
        if (isSummaryVisible) {
            setIsSummaryVisible(false);
            setIsInputVisible(false);
        } else {
            setIsSummaryVisible(true);
            setIsInputVisible(true);
        }

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

    const handleRecentNotesClick = () => {
        if (showRecentNotes) {
            setShowRecentNotes(false);
        } else {
            setShowRecentNotes(true);
        }
    };

    const handleNewSparkClick = () => {
        if (isInputVisible) {
            setIsInputVisible(false);
        } else {
            setIsInputVisible(true);
        }
    };  

    const handleEventsClick = () => {
        if (isEventsVisible) {
            setIsInputVisible(false);
            setIsEventsVisible(false);
            setIsSummaryVisible(false);
        } else {
            setIsInputVisible(true);
            setIsEventsVisible(true);
            setIsSummaryVisible(false);
        }
    };

    const handleTasksClick = () => {
        if (isTasksVisible) {
            setIsTasksVisible(false);
        } else {
            setIsTasksVisible(true);
        }
    };

    const handleInputBarClick = () => {
        if (isInputBarVisible) {
            setIsInputBarVisible(false);
        } else {
            setIsInputBarVisible(true);
        }
    };

    const handleToolBarClick = () => {
        if (isToolBarCollapsed) {
            setIsToolBarCollapsed(false);
        } else {
            setIsToolBarCollapsed(true);
        }
    };
    
    return (
        <ToolBarContainer isToolBarCollapsed={isToolBarCollapsed}>
            <Column main="spaceBetween" cross="start">   
                <Container width="100%" height="100%">
                    {!isToolBarCollapsed && <Spacer height='xl'/>}
                    {!isToolBarCollapsed && <Row main="start" cross="center" gap="md">
                        <IconWrapper>
                            <TbFileTextSpark size={14} />
                        </IconWrapper>
                        <h1 style={{ margin: 0, fontSize: '1.1rem'}}>Sparkpad</h1>
                        <Spacer expand={true}/>
                        <IconButton onClick={handleToolBarClick}>
                            <FaChevronLeft size={14} />
                        </IconButton>
                    </Row>}
                    {!isToolBarCollapsed && <Spacer height='lg'/>}
                    {isToolBarCollapsed && <SecondaryButton onClick={handleToolBarClick}><FaChevronRight size={14} /></SecondaryButton>}
                    {isToolBarCollapsed ? <SecondaryButton onClick={handleToolBarClick}><FaSearch size={14} /></SecondaryButton> : <SearchBar onSearch={handleSearch} />}
                    {!isToolBarCollapsed && <SmallHeader>Tools</SmallHeader>}
                    <SecondaryButton onClick={handleInputBarClick} title="Create a new spark">
                        <FaPen size={14} />
                        {isToolBarCollapsed ? null : 'Capture'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleOrganizeClick} title="Automatically organize your sparks into sparkpads">
                        <FaWandMagicSparkles size={14} />
                        {isToolBarCollapsed ? null : 'Organize'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleSummaryClick} title="Summarize your sparks into a concise summary">
                        <FaLightbulb size={14} />
                        {isToolBarCollapsed ? null : 'Snapshot'}
                    </SecondaryButton>
                    {/*
                    <SecondaryButton onClick={handleVisualizeClick} title="Visualize your sparks in a tree structure">
                        <FaFolderTree size={14} />
                        {isToolBarCollapsed ? null : 'Visualize'}
                    </SecondaryButton> */}
                    {!isToolBarCollapsed && <SmallHeader>Explore</SmallHeader>}
                    <SecondaryButton onClick={handleEventsClick} title="View your Google Calendar events">
                        <FaCalendar size={14} />
                        {isToolBarCollapsed ? null : 'Google'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleRecentNotesClick} title="View your recent sparks">
                        <FaClock size={14} />
                        {isToolBarCollapsed ? null : 'Recent'}
                    </SecondaryButton>
                </Container>
                <Container width="100%">
                    <SecondaryButton onClick={handleSettingsClick} title="Configure your Sparkpad settings">
                        <FaGear size={14} />
                        {isToolBarCollapsed ? null : 'Settings'}
                    </SecondaryButton>
                </Container>
            </Column>
        </ToolBarContainer>
    )
}
