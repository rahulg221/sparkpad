import { useState } from 'react';
import { Column, Container, Row, Spacer, Stack } from '../../styles/shared/BaseLayout';
import { FaChevronLeft, FaChevronRight, FaLightbulb, FaSearch, FaSignOutAlt, FaPen} from 'react-icons/fa';
import { SecondaryButton, IconButton } from '../../styles/shared/Button.styles';
import { IconWrapper, ToolBarContainer, SmallHeader } from './ToolBar.Styles';
import { FaBook, FaClockRotateLeft, FaFolderTree, FaGear, FaTableColumns, FaTimeline, FaWandMagicSparkles, FaWindowMaximize, FaWindowMinimize, FaWindowRestore, FaWindows } from 'react-icons/fa6';
import { useActions } from '../../context/ActionsContext';
import { useSummary } from '../../context/SummaryProvider';
import { SearchBar } from '../searchbar/SearchBar';
import { useNotes } from '../../context/NotesProvider';
import { TbServerSpark } from 'react-icons/tb';
import { Circle } from '../sidebar/SideBar.Styles';

export const ToolBar = () => {
    const { setIsSettingsVisible, setIsInputVisible, setIsToolBarCollapsed, isToolBarCollapsed } = useActions();
    const { createSummary, isSummaryVisible, setIsSummaryVisible } = useSummary();
    const { showTree, autoOrganizeNotes, semanticSearch, setShowTree, setShowRecentNotes } = useNotes();

    const handleSummaryClick = () => {
        if (!isSummaryVisible) {
            setIsSummaryVisible(true);
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
        setShowRecentNotes(true);
    };

    const handleNewSparkClick = () => {
        setIsInputVisible(true);
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
                <Container width="100%">
                    {!isToolBarCollapsed && <Spacer height='xl'/>}
                    {!isToolBarCollapsed && <Row main="start" cross="center" gap="sm">
                        <IconWrapper>
                            <TbServerSpark size={14} />
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
                    <SecondaryButton onClick={handleNewSparkClick}>
                        <FaPen size={14} />
                        {isToolBarCollapsed ? null : 'Capture'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleOrganizeClick}>
                        <FaWandMagicSparkles size={14} />
                        {isToolBarCollapsed ? null : 'Organize'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleSummaryClick}>
                        <FaLightbulb size={14} />
                        {isToolBarCollapsed ? null : 'Summarize'}
                    </SecondaryButton>
                    {!isToolBarCollapsed && <SmallHeader>Explore</SmallHeader>}
                    <SecondaryButton onClick={handleVisualizeClick}>
                        <FaFolderTree size={14} />
                        {isToolBarCollapsed ? null : 'Tree'}
                    </SecondaryButton>
                    <SecondaryButton onClick={handleRecentNotesClick}>
                        <FaTableColumns size={14} />
                        {isToolBarCollapsed ? null : 'Panel'}
                    </SecondaryButton>
                </Container>
                <Container width="100%">
                    <SecondaryButton onClick={handleSettingsClick}>
                        <FaGear size={14} />
                        {isToolBarCollapsed ? null : 'Settings'}
                    </SecondaryButton>
                </Container>
            </Column>
        </ToolBarContainer>
    )
}
