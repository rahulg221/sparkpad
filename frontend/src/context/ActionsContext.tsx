// context/AppActionsContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { NoteService } from '../api/noteService';
import { useAuth } from './AuthContext';
import { Note } from '../models/noteModel';
import CalendarService from '../api/calendarService';

type ActionsContextType = {
  autoOrganizeNotes: () => void;
  showSummary: () => void;
  setNotificationMessage: (message: string) => void;
  setShowNotification: (show: boolean) => void;
  setSummary: (summary: string) => void;
  setCurrentNotes: (notes: Note[]) => void;
  getLastSnapshot: () => void;
  semanticSearch: (query: string) => void;
  setSearchResults: (results: Note[]) => void;
  updateTasks: () => void;
  updateEvents: () => void;
  setCategories: (categories: string[]) => void;        
  searchResults: Note[];
  isLoading: boolean;
  notificationMessage: string;
  showNotification: boolean;
  summary: string;
  categories: string[];
  bulletPoints: string[];
  calendarEvents: string[];
  tasks: string[];
  currentNotes: Note[];
};

export const ActionsContext = createContext<ActionsContextType | null>(null);

export const ActionsProvider = ({ children }: { children: ReactNode }) => {
    const { user, isGoogleConnected } = useAuth();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [bulletPoints, setBulletPoints] = useState<string[]>([]);
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [tasks, setTasks] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const autoOrganizeNotes = async () => {
        try {
            const notes = await NoteService.getNotes(user?.id || '');
            if (notes.length < 15) {
                setNotificationMessage('You need at least 15 notes to auto-organize');
                setShowNotification(true);
                return;
            }
            setIsLoading(true);
            await NoteService.groupAndLabelNotes(notes);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error('Error testing clustering:', err);
        }
    };
    
    const showSummary = async () => {
        setIsLoading(true);
        try {
            if (currentNotes.length === 0) {
                const notes = await NoteService.getNotes(user?.id || '', 50);
                setCurrentNotes(notes);
            }

            const summary = await NoteService.summarizeNotes(currentNotes);
            setSummary(summary);

            localStorage.setItem('last_summary', summary);

            const bulletpoints = summary
            .trim()
            .split('\n')
            .map(line => line.replace(/^[-]\s*/, '').trim());

            setBulletPoints(bulletpoints);
            console.log(bulletpoints);
        } catch (err) {
            console.error('Error summarizing daily notes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateTasks = async () => {
        console.log('updateTasks');
        console.log(isGoogleConnected);
        if (!isGoogleConnected) return;
        console.log('isGoogleConnected');
        
        try {
            const tasks = await CalendarService.getTasks(); 
            localStorage.setItem('last_tasks', JSON.stringify(tasks));
            console.log(tasks);
            setTasks(tasks);
        } catch (err) {
            console.error("Failed to update tasks:", err);
        }
    };
        
    const updateEvents = async () => {
        if (!isGoogleConnected) return;
        
        try {
            const events = await CalendarService.getCalendarEvents(); 
            localStorage.setItem('last_events', JSON.stringify(events));
            console.log(events);
            setCalendarEvents(events); 
        } catch (err) {
            console.error("Failed to update events:", err);
        }
    };      

    const getLastSnapshot = async () => {
        let last_summary = '';
        let last_events = [];
        let last_tasks = [];

        try {
            setIsLoading(true);
            
            if (localStorage.getItem('last_summary')) {
                last_summary = localStorage.getItem('last_summary') || '';
            } else {
                last_summary = 'Click Snapshot to generate a summary of your current view.';
            }
            
            if (localStorage.getItem('last_events')) {
                last_events = JSON.parse(localStorage.getItem('last_events') || '[]');
            } else {
                const dateTime = new Date().toLocaleString();
                last_events = [dateTime + '#Sync your Google Account then create events by describing them in the capture section.'];
            }   

            // Fix out flat part later 
            if (localStorage.getItem('last_tasks')) {
                last_tasks = JSON.parse(localStorage.getItem('last_tasks') || '[]');
            } else {
                last_tasks = ['Sync your Google Account then create tasks by describing them in the capture section.'];
            }

            setSummary(last_summary!);

            const bulletpoints = last_summary!
            .trim()
            .split('\n')
            .map(line => line.replace(/^[-]\s*/, '').trim());

            setCalendarEvents(last_events);
            setTasks(last_tasks);
            setBulletPoints(bulletpoints);

            setIsLoading(false);
        } catch (err) {
            console.error('Error finding last summary:', err);
            setIsLoading(false);
        }
    };

    const semanticSearch = async (query: string) => {
        try {
            setIsLoading(true);
            const results = await NoteService.semanticSearch(query);
            setSearchResults(results);
            setIsLoading(false);
        } catch (err) {
            console.error('Error semantic searching:', err);    
        }
    };

    return (
        <ActionsContext.Provider value={{ showSummary, autoOrganizeNotes, getLastSnapshot, setNotificationMessage, setShowNotification, setSummary, setCurrentNotes, semanticSearch, setSearchResults, setCategories, isLoading, notificationMessage, showNotification, summary, bulletPoints, currentNotes, calendarEvents, searchResults, tasks, updateTasks, updateEvents, categories}}>
            {children}
        </ActionsContext.Provider>
    );
};

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) throw new Error("useActions must be used within AppActionsProvider");
  return context;
};
