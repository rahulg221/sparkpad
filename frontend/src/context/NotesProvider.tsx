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
    sortingUpdates: string[];
    isCategoriesLoading: boolean;
    isSortingUpdatesVisible: boolean;
    showTree: boolean;
    showRecentNotes: boolean;
    writeInCurrentCategory: boolean;
    refreshNotes: boolean;
    clusteredUpdates: string[];
    rollbackNotes: Note[];
    autoOrganizeNotes: () => void;
    setCurrentNotes: (notes: Note[]) => void;
    setCurrentCategory: (category: string) => void;
    setIsCategoriesLoading: (loading: boolean) => void;
    semanticSearch: (query: string) => void;
    setSearchResults: (results: Note[]) => void;
    setShowTree: (show: boolean) => void;
    setShowRecentNotes: (show: boolean) => void;
    setWriteInCurrentCategory: (write: boolean) => void;
    setRefreshNotes: (refresh: boolean) => void;
    setIsSortingUpdatesVisible: (visible: boolean) => void;
    setSortingUpdates: (updates: string[]) => void;
    setClusteredUpdates: (updates: string[]) => void;
    setRollbackNotes: (notes: Note[]) => void;
}

export const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>(''); 
    const [searchResults, setSearchResults] = useState<Note[]>([]);  
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
    const [isSortingUpdatesVisible, setIsSortingUpdatesVisible] = useState(false);
    const [sortingUpdates, setSortingUpdates] = useState<string[]>([]);
    const [showTree, setShowTree] = useState<boolean>(false);
    const [showRecentNotes, setShowRecentNotes] = useState<boolean>(false);
    const [writeInCurrentCategory, setWriteInCurrentCategory] = useState<boolean>(false);
    const [refreshNotes, setRefreshNotes] = useState<boolean>(false);
    const [isSortingUpdatesLoading, setIsSortingUpdatesLoading] = useState<boolean>(false);     
    const [clusteredUpdates, setClusteredUpdates] = useState<string[]>([]);
    const [rollbackNotes, setRollbackNotes] = useState<Note[]>([]);
    const { user } = useAuth();
    useActions();

    const autoOrganizeNotes = async () => {
        try {
            setIsCategoriesLoading(true);
            const rollbackNotes = await NoteService.getRollbackNotes(user?.id ?? '');
            setRollbackNotes(rollbackNotes);

            const response = await NoteService.groupAndLabelNotes();
            setIsCategoriesLoading(false);

            if (response.sorting_updates.length > 0 || response.clustered_updates.length > 0) {
                setIsSortingUpdatesVisible(true);
                setSortingUpdates(response.sorting_updates);
                setClusteredUpdates(response.clustered_updates);
            }
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
            setIsSearchLoading(false);
        }
    };

    return <NotesContext.Provider value={{ currentNotes, currentCategory, searchResults, isSearchLoading, isCategoriesLoading, isSortingUpdatesVisible, sortingUpdates, clusteredUpdates, showTree, showRecentNotes, writeInCurrentCategory, refreshNotes, autoOrganizeNotes, setCurrentNotes, setCurrentCategory, semanticSearch, setSearchResults, setShowTree, setShowRecentNotes, setWriteInCurrentCategory, setRefreshNotes, setIsSortingUpdatesVisible, setSortingUpdates, setClusteredUpdates, setRollbackNotes, rollbackNotes, setIsCategoriesLoading }}>{children}</NotesContext.Provider>;
};  

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) throw new Error("useNotes must be used within a NotesProvider");
    return context;
};


