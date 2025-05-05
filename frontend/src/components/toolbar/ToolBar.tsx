import { Column, Container, Row, Spacer } from '../../styles/shared/BaseLayout';
import { FaChevronLeft, FaChevronRight, FaLightbulb, FaSearch, FaCalendar, FaThumbtack, FaStickyNote} from 'react-icons/fa';
import { SecondaryButton, IconButton, TextButton } from '../../styles/shared/Button.styles';
import { IconWrapper, ToolBarContainer, SmallHeader } from './ToolBar.Styles';
import { FaClock, FaGear, FaPen, FaPlus, FaWandMagicSparkles } from 'react-icons/fa6';
import { useActions } from '../../context/ActionsContext';
import { useSummary } from '../../context/SummaryProvider';
import { SearchBar } from './searchbar/SearchBar';
import { useNotes } from '../../context/NotesProvider';
import { TbFileTextSpark } from 'react-icons/tb';
import { IoSparkles } from 'react-icons/io5';
export const ToolBar = () => {
    const { setIsSettingsVisible, setIsSidebarVisible, setIsToolBarCollapsed, isToolBarCollapsed, setIsEventsVisible, isEventsVisible, setIsTasksVisible, isTasksVisible, isSidebarVisible, setIsInputBarVisible, isInputBarVisible  } = useActions();
    const { createSummary, isSummaryVisible, setIsSummaryVisible } = useSummary();
    const { showTree, autoOrganizeNotes, semanticSearch, setShowTree, setShowRecentNotes, showRecentNotes, setWriteInCurrentCategory, writeInCurrentCategory } = useNotes();

    const handleSummaryClick = () => {
        if (isSummaryVisible) {
            setIsSummaryVisible(false);
            setIsSidebarVisible(false);
        } else {
            setIsSummaryVisible(true);
            setIsSidebarVisible(true);
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
        if (isSidebarVisible) {
            setIsSidebarVisible(false);
        } else {
            setIsSidebarVisible(true);
        }
    };  

    const handleEventsClick = () => {
        if (isEventsVisible) {
            setIsSidebarVisible(false);
            setIsEventsVisible(false);
            setIsSummaryVisible(false);
        } else {
            setIsSidebarVisible(true);
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
            setWriteInCurrentCategory(false);
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
                    {isToolBarCollapsed && <TextButton onClick={handleToolBarClick} title="Collapse the toolbar"><FaChevronRight size={14} /></TextButton>}
                    {isToolBarCollapsed ? <TextButton onClick={handleToolBarClick} title="Search for a spark"><FaSearch size={14} /></TextButton> : <SearchBar onSearch={handleSearch} />}
                    {!isToolBarCollapsed && <SmallHeader>TOOLS</SmallHeader>}
                    <TextButton onClick={handleInputBarClick} title="Create a new spark">
                        <FaPen size={14} />
                        {isToolBarCollapsed ? null : 'Capture'}
                    </TextButton>
                    <TextButton onClick={handleOrganizeClick} title="Automatically organize your sparks into sparkpads">
                        <FaWandMagicSparkles size={14} />
                        {isToolBarCollapsed ? null : 'Organize'}
                    </TextButton>
                    <TextButton onClick={handleSummaryClick} title="Summarize your sparks into a concise summary">
                        <FaLightbulb size={14} />
                        {isToolBarCollapsed ? null : 'Summarize'}
                    </TextButton>
                    {/*
                    <SecondaryButton onClick={handleVisualizeClick} title="Visualize your sparks in a tree structure">
                        <FaFolderTree size={14} />
                        {isToolBarCollapsed ? null : 'Visualize'}
                    </SecondaryButton> */}
                    {!isToolBarCollapsed && <SmallHeader>WORKSPACE</SmallHeader>}
                    <TextButton onClick={handleEventsClick} title="View your Google Calendar events">
                        <FaClock size={14} />
                        {isToolBarCollapsed ? null : 'Upcoming'}
                    </TextButton>
                    <TextButton onClick={handleRecentNotesClick} title="View your recent sparks">
                        <FaStickyNote size={14} />
                        {isToolBarCollapsed ? null : 'Sticky Notes'}
                    </TextButton>
                </Container>
                <Container width="100%">
                    <TextButton onClick={handleSettingsClick} title="Configure your Sparkpad settings">
                        <FaGear size={14} />
                        {isToolBarCollapsed ? null : 'Settings'}
                    </TextButton>
                </Container>
            </Column>
        </ToolBarContainer>
    )
}
