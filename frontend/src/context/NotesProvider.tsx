import { createContext, ReactNode, useContext, useState } from "react";
import { Note } from "../models/noteModel";
import { NoteService } from "../api/noteService";
import { useAuth } from "./AuthProvider";
import { useActions } from "./ActionsContext";

type NotesContextType = {
    currentNotes: Note[];
    currentCategory: string;
    searchResults: Note[];
    isSearchLoading: boolean;
    isCategoriesLoading: boolean;
    showTree: boolean;
    showRecentNotes: boolean;
    writeInCurrentCategory: boolean;
    refreshNotes: boolean;
    autoOrganizeNotes: () => void;
    setCurrentNotes: (notes: Note[]) => void;
    setCurrentCategory: (category: string) => void;
    semanticSearch: (query: string) => void;
    setSearchResults: (results: Note[]) => void;
    setShowTree: (show: boolean) => void;
    setShowRecentNotes: (show: boolean) => void;
    setWriteInCurrentCategory: (write: boolean) => void;
    setRefreshNotes: (refresh: boolean) => void;
}

export const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>(''); 
    const [searchResults, setSearchResults] = useState<Note[]>([]);  
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
    const [showTree, setShowTree] = useState<boolean>(false);
    const [showRecentNotes, setShowRecentNotes] = useState<boolean>(false);
    const [writeInCurrentCategory, setWriteInCurrentCategory] = useState<boolean>(false);
    const [refreshNotes, setRefreshNotes] = useState<boolean>(false);
    const { user } = useAuth();
    const { setNotificationMessage, setShowNotification } = useActions();

    const autoOrganizeNotes = async () => {
        try {
            setIsCategoriesLoading(true);

            const notes = await NoteService.getNotesForClustering(user?.id || '');
            console.log(notes.length);
            if (notes.length < 15) {
                setNotificationMessage('You need at least 15 notes in unlocked sparkpads to auto-organize');
                setShowNotification(true);
                setIsCategoriesLoading(false);  
                return;
            }

            await NoteService.groupAndLabelNotes(notes);
            setIsCategoriesLoading(false);
        } catch (err) {
            setIsCategoriesLoading(false);
            console.error('Error testing clustering:', err);
        }
    };

    const semanticSearch = async (query: string) => {
        try {
            setIsSearchLoading(true);
            const results = await NoteService.semanticSearch(query);
            setSearchResults(results);
            setIsSearchLoading(false);
        } catch (err) {
            console.error('Error semantic searching:', err);    
        }
    };

    return <NotesContext.Provider value={{ currentNotes, currentCategory, searchResults, isSearchLoading, isCategoriesLoading, showTree, showRecentNotes, writeInCurrentCategory, refreshNotes, autoOrganizeNotes, setCurrentNotes, setCurrentCategory, semanticSearch, setSearchResults, setShowTree, setShowRecentNotes, setWriteInCurrentCategory, setRefreshNotes }}>{children}</NotesContext.Provider>;
};  

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) throw new Error("useNotes must be used within a NotesProvider");
    return context;
};


