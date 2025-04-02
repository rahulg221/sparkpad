// context/AppActionsContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { NoteService } from '../api/noteService';
import { useAuth } from './authContext';
import { Note } from '../models/noteModel';
import CalendarService from '../api/calendarService';

type ActionsContextType = {
  autoOrganizeNotes: () => void;
  showSnapshot: () => void;
  setNotificationMessage: (message: string) => void;
  setShowNotification: (show: boolean) => void;
  setSummary: (summary: string) => void;
  setCurrentNotes: (notes: Note[]) => void;
  getLastSnapshot: () => void;
  semanticSearch: (query: string) => void;
  setSearchResults: (results: Note[]) => void;
  updateTasks: () => void;
  updateEvents: () => void;
  searchResults: Note[];
  isLoading: boolean;
  notificationMessage: string;
  showNotification: boolean;
  summary: string;
  bulletPoints: string[];
  calendarEvents: string[];
  tasks: string[];
  currentNotes: Note[];
};

export const ActionsContext = createContext<ActionsContextType | null>(null);

export const ActionsProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [bulletPoints, setBulletPoints] = useState<string[]>([]);
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [tasks, setTasks] = useState<string[]>([]);

    const autoOrganizeNotes = async () => {
        try {
            const notes = await NoteService.getNotes(user?.id || '');
            if (notes.length < 16) {
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
    
    const showSnapshot = async () => {
        try {
            setIsLoading(true);
            //await updateTasks();
            //await updateEvents();
            const summary = await NoteService.summarizeNotes(currentNotes);
            setSummary(summary);

            localStorage.setItem('last_summary', summary);

            const bulletpoints = summary
            .trim()
            .split('\n')
            .map(line => line.replace(/^[-]\s*/, '').trim());

            setBulletPoints(bulletpoints);
            console.log(bulletpoints);
            setIsLoading(false);
        } catch (err) {
            console.error('Error summarizing daily notes:', err);
            setIsLoading(false);
        }
    };

    const updateTasks = async () => {
        try {
            const tasks = await CalendarService.getTasks(); 
            localStorage.setItem('last_tasks', JSON.stringify(tasks));
            setTasks(tasks);
        } catch (err) {
            console.error("Failed to update tasks:", err);
        }
    };
        
    const updateEvents = async () => {
        try {
            const events = await CalendarService.getCalendarEvents(); 
            localStorage.setItem('last_events', JSON.stringify(events));
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
                last_events = [];
            }   

            if (localStorage.getItem('last_tasks')) {
                last_tasks = JSON.parse(localStorage.getItem('last_tasks') || '[]');
            } else {
                last_tasks = [];
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
        <ActionsContext.Provider value={{ showSnapshot, autoOrganizeNotes, getLastSnapshot, setNotificationMessage, setShowNotification, setSummary, setCurrentNotes, semanticSearch, setSearchResults, isLoading, notificationMessage, showNotification, summary, bulletPoints, currentNotes, calendarEvents, searchResults, tasks, updateTasks, updateEvents}}>
            {children}
        </ActionsContext.Provider>
    );
};

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) throw new Error("useActions must be used within AppActionsProvider");
  return context;
};
