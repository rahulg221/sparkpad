import { createContext, ReactNode, useContext, useState } from 'react';
import { NoteService } from '../api/noteService';
import { useAuth } from './AuthProvider';
import { Note } from '../models/noteModel';
import CalendarService from '../api/calendarService';

type ActionsContextType = {
  autoOrganizeNotes: () => void;
  setNotificationMessage: (message: string) => void;
  setShowNotification: (show: boolean) => void;
  setCurrentNotes: (notes: Note[]) => void;
  getLastSnapshot: () => void;
  updateTasks: () => void;
  updateEvents: () => void;
  setCategories: (categories: string[]) => void;    
  setIsSettingsVisible: (visible: boolean) => void;   
  isLoading: boolean;
  notificationMessage: string;
  showNotification: boolean;
  categories: string[];
  calendarEvents: string[];
  tasks: string[];
  currentNotes: Note[];
  isSettingsVisible: boolean;           
};

export const ActionsContext = createContext<ActionsContextType | null>(null);

export const ActionsProvider = ({ children }: { children: ReactNode }) => {
    const { user, isGoogleConnected } = useAuth();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<string[]>([]);
    const [tasks, setTasks] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
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
            setCalendarEvents(last_events);
            setTasks(last_tasks);
            setIsLoading(false);
        } catch (err) {
            console.error('Error finding last summary:', err);
            setIsLoading(false);
        }
    };

    return (
        <ActionsContext.Provider value={{ 
            autoOrganizeNotes, 
            getLastSnapshot, 
            setNotificationMessage, 
            setShowNotification, 
            setCurrentNotes, 
            setCategories, 
            setIsSettingsVisible,
            isLoading, 
            notificationMessage, 
            showNotification, 
            categories, 
            calendarEvents, 
            tasks, 
            currentNotes,
            updateTasks,
            updateEvents,
            isSettingsVisible
        }}>
            {children}
        </ActionsContext.Provider>
    );
};

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) throw new Error("useActions must be used within AppActionsProvider");
  return context;
};
