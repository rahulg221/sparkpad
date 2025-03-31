// context/AppActionsContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { NoteService } from '../api/noteService';
import { useAuth } from './AuthContext';
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
  isLoading: boolean;
  notificationMessage: string;
  showNotification: boolean;
  summary: string;
  bulletPoints: string[];
  calendarEvents: string[];
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
            const summary = await NoteService.summarizeNotes(currentNotes, user?.id || '');
            const events = await CalendarService.getCalendarEvents();

            setSummary(summary);

            localStorage.setItem('last_summary', summary);
            localStorage.setItem('last_events', JSON.stringify(events));

            const bulletpoints = summary
            .trim()
            .split('\n')
            .map(line => line.replace(/^[-]\s*/, '').trim());

            setCalendarEvents(events);
            setBulletPoints(bulletpoints);
            console.log(bulletpoints);
            setIsLoading(false);
        } catch (err) {
            console.error('Error summarizing daily notes:', err);
            setIsLoading(false);
        }
    };

    const getLastSnapshot = async () => {
        let last_summary = '';
        let last_events = [];

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

            setSummary(last_summary!);

            const bulletpoints = last_summary!
            .trim()
            .split('\n')
            .map(line => line.replace(/^[-]\s*/, '').trim());

            setCalendarEvents(last_events);
            setBulletPoints(bulletpoints);

            setIsLoading(false);
        } catch (err) {
            console.error('Error finding last summary:', err);
            setIsLoading(false);
        }
    };

    return (
        <ActionsContext.Provider value={{ showSnapshot, autoOrganizeNotes, getLastSnapshot, setNotificationMessage, setShowNotification, setSummary, setCurrentNotes,  isLoading, notificationMessage, showNotification, summary, bulletPoints, currentNotes, calendarEvents}}>
            {children}
        </ActionsContext.Provider>
    );
};

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) throw new Error("useActions must be used within AppActionsProvider");
  return context;
};
