import { SideBar } from '../components/sidebar/SideBar';
import { Dashboard } from '../components/dashboard/Dashboard';
import styled from 'styled-components';
import { useState } from 'react';
import { FloatingButton } from '../styles/shared/Button.styles';
import { ToolBar } from '../components/toolbar/ToolBar';
import { FaPen, FaPlus } from 'react-icons/fa';
import { Row, Spacer } from '../styles/shared/BaseLayout';
import { useActions } from '../context/ActionsContext';
import { InputBar } from '../components/inputbar/InputBar';
import { NotesRow } from '../components/dashboard/notesrow/NotesRow';
import { NoteCategories } from '../components/dashboard/categories/NoteCategories';

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.spacing.xl};
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.dotColor} 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  display: flex;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgPure};

  /* Hide scrollbar by default */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }

  /* Show scrollbar on hover */
  &:hover::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
  }

  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover {
    scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
  }
`;

export const DashboardPage = () => {

  return (  
    <>
      <PageLayout>
        <ToolBar />
        <MainContent>
          <NotesRow />
          <Row main="start" cross="start" gap='md'>
            <NoteCategories />
            <Dashboard />
          </Row>
        </MainContent>
        <SideBar/>
      </PageLayout>
    </>
  );
};