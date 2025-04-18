import { createContext, ReactNode, useContext, useState } from 'react';
import { NoteService } from '../api/noteService';
import { useAuth } from './AuthProvider';
import { Note } from '../models/noteModel';
import CalendarService from '../api/calendarService';

type ActionsContextType = {
  setNotificationMessage: (message: string) => void;
  setShowNotification: (show: boolean) => void;
  setCurrentNotes: (notes: Note[]) => void;
  updateTasks: () => void;
  updateEvents: () => void;
  setCategories: (categories: string[]) => void;    
  setIsSettingsVisible: (visible: boolean) => void;   
  setIsInputVisible: (visible: boolean) => void;        
  setIsToolBarCollapsed: (collapsed: boolean) => void;      
  isLoading: boolean;
  isInputVisible: boolean;
  isToolBarCollapsed: boolean;
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
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [isToolBarCollapsed, setIsToolBarCollapsed] = useState(false);

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

    return (
        <ActionsContext.Provider value={{ 
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
            isSettingsVisible,
            isInputVisible,
            setIsInputVisible,
            isToolBarCollapsed,
            setIsToolBarCollapsed
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
