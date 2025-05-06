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
  updateTasks: (newTask: boolean) => void;
  updateEvents: (newEvent: boolean) => void;
  setCategories: (categories: string[]) => void;    
  setIsEventsVisible: (visible: boolean) => void;
  setIsTasksVisible: (visible: boolean) => void;
  setIsSettingsVisible: (visible: boolean) => void;   
  setIsSidebarVisible: (visible: boolean) => void;        
  setIsToolBarCollapsed: (collapsed: boolean) => void;   
  setIsInputBarVisible: (visible: boolean) => void;
  notificationType: string;
  isLoading: boolean;
  isSidebarVisible: boolean;
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
    const { user } = useAuth();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<string[]>([]);
    const [tasks, setTasks] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isToolBarCollapsed, setIsToolBarCollapsed] = useState(false);
    const [isEventsVisible, setIsEventsVisible] = useState(false);
    const [isTasksVisible, setIsTasksVisible] = useState(false);
    const [isInputBarVisible, setIsInputBarVisible] = useState(false);
    
    const updateTasks = async (newTask: boolean = false) => {
        if (!user?.isGoogleConnected) return;

        if (newTask) {
            const tasks = await CalendarService.getTasks(); 
            localStorage.setItem('last_tasks', JSON.stringify(tasks));
            localStorage.setItem('last_tasks_timestamp', new Date().getTime().toString());
            setTasks(tasks);
        } else {
            try {
                if (localStorage.getItem('last_tasks') && localStorage.getItem('last_tasks_timestamp') && new Date().getTime() - parseInt(localStorage.getItem('last_tasks_timestamp') || '0') < 1000 * 60 * 45) {
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
        }
    };
        
    const updateEvents = async (newEvent: boolean) => {
        if (!user?.isGoogleConnected) return;
        
        if (newEvent) {
            const events = await CalendarService.getCalendarEvents(); 
            localStorage.setItem('last_events', JSON.stringify(events));
            localStorage.setItem('last_events_timestamp', new Date().getTime().toString());
            setCalendarEvents(events);
        } else {
            try {
                if (localStorage.getItem('last_events') && localStorage.getItem('last_events_timestamp') && new Date().getTime() - parseInt(localStorage.getItem('last_events_timestamp') || '0') < 1000 * 60 * 45) {
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
            isSidebarVisible,
            setIsSidebarVisible,
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
