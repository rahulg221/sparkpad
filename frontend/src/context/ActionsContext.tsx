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
  isLoading: boolean;
  notificationMessage: string;
  showNotification: boolean;
  summary: string;
  bulletPoints: string[];
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
    const [googleAuthUrl, setGoogleAuthUrl] = useState('');

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
            const summary = await NoteService.summarizeNotes(currentNotes);
            setSummary(summary);

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

    return (
        <ActionsContext.Provider value={{ showSnapshot, autoOrganizeNotes, setNotificationMessage, setShowNotification, setSummary, setCurrentNotes,  isLoading, notificationMessage, showNotification, summary, bulletPoints, currentNotes}}>
            {children}
        </ActionsContext.Provider>
    );
};

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) throw new Error("useActions must be used within AppActionsProvider");
  return context;
};
