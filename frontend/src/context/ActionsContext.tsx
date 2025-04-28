import { createContext, ReactNode, useContext, useState } from 'react';
import { NoteService } from '../api/noteService';
import { useAuth } from './AuthProvider';
import { Note } from '../models/noteModel';
import CalendarService from '../api/calendarService';

type ActionsContextType = {
  setNotificationMessage: (message: string) => void;
  setShowNotification: (show: boolean) => void;
  setNotificationType: (type: string) => void;  
  setCurrentNotes: (notes: Note[]) => void;
  updateTasks: () => void;
  updateEvents: () => void;
  setCategories: (categories: string[]) => void;    
  setIsEventsVisible: (visible: boolean) => void;
  setIsTasksVisible: (visible: boolean) => void;
  setIsSettingsVisible: (visible: boolean) => void;   
  setIsInputVisible: (visible: boolean) => void;        
  setIsToolBarCollapsed: (collapsed: boolean) => void;   
  setIsInputBarVisible: (visible: boolean) => void;
  notificationType: string;
  isLoading: boolean;
  isInputVisible: boolean;
  isEventsVisible: boolean;                                             
  isToolBarCollapsed: boolean;
  isTasksVisible: boolean;
  notificationMessage: string;
  showNotification: boolean;
  categories: string[];
  calendarEvents: string[];
  tasks: string[];
  isInputBarVisible: boolean;
  currentNotes: Note[];
  isSettingsVisible: boolean;           
};

export const ActionsContext = createContext<ActionsContextType | null>(null);

export const ActionsProvider = ({ children }: { children: ReactNode }) => {
    const { user, isGoogleConnected } = useAuth();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<string[]>([]);
    const [tasks, setTasks] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [isToolBarCollapsed, setIsToolBarCollapsed] = useState(false);
    const [isEventsVisible, setIsEventsVisible] = useState(false);
    const [isTasksVisible, setIsTasksVisible] = useState(false);
    const [isInputBarVisible, setIsInputBarVisible] = useState(false);
    const updateTasks = async () => {
        if (!isGoogleConnected) return;

        try {
            if (localStorage.getItem('last_tasks') && localStorage.getItem('last_tasks_timestamp') && new Date().getTime() - parseInt(localStorage.getItem('last_tasks_timestamp') || '0') < 1000 * 60 * 15) {
                const tasks = JSON.parse(localStorage.getItem('last_tasks') || '[]');
                setTasks(tasks);
            } else {
                const tasks = await CalendarService.getTasks(); 
                localStorage.setItem('last_tasks', JSON.stringify(tasks));
                localStorage.setItem('last_tasks_timestamp', new Date().getTime().toString());
                console.log(tasks);
                setTasks(tasks);
            }
        } catch (err) {
            console.error("Failed to update tasks:", err);
        }
    };
        
    const updateEvents = async () => {
        if (!isGoogleConnected) return;
        
        try {
            if (localStorage.getItem('last_events') && localStorage.getItem('last_events_timestamp') && new Date().getTime() - parseInt(localStorage.getItem('last_events_timestamp') || '0') < 1000 * 60 * 15) {
                const events = JSON.parse(localStorage.getItem('last_events') || '[]');
                setCalendarEvents(events);
            } else {
                const events = await CalendarService.getCalendarEvents(); 
                localStorage.setItem('last_events', JSON.stringify(events));
                localStorage.setItem('last_events_timestamp', new Date().getTime().toString());
                console.log(events);
                setCalendarEvents(events); 
            }
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
            setIsEventsVisible,
            setNotificationType,
            notificationType,
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
            setIsToolBarCollapsed,
            isEventsVisible,
            isTasksVisible,
            setIsTasksVisible,
            isInputBarVisible,
            setIsInputBarVisible,
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
