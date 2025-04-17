import { createContext, ReactNode, useContext, useState } from "react";
import { Note } from "../models/noteModel";
import { NoteService } from "../api/noteService";

type NotesContextType = {
    currentNotes: Note[];
    currentCategory: string;
    searchResults: Note[];
    isNoteLoading: boolean;
    showTree: boolean;
    setCurrentNotes: (notes: Note[]) => void;
    setCurrentCategory: (category: string) => void;
    semanticSearch: (query: string) => void;
    setSearchResults: (results: Note[]) => void;
    setShowTree: (show: boolean) => void;
}

export const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
    const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>(''); 
    const [searchResults, setSearchResults] = useState<Note[]>([]);  
    const [isNoteLoading, setIsNoteLoading] = useState<boolean>(false);
    const [showTree, setShowTree] = useState<boolean>(false);

    const semanticSearch = async (query: string) => {
        try {
            setIsNoteLoading(true);
            const results = await NoteService.semanticSearch(query);
            setSearchResults(results);
            setIsNoteLoading(false);
        } catch (err) {
            console.error('Error semantic searching:', err);    
        }
    };

    return <NotesContext.Provider value={{ currentNotes, currentCategory, searchResults, isNoteLoading, showTree, setCurrentNotes, setCurrentCategory, semanticSearch, setSearchResults, setShowTree }}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) throw new Error("useNotes must be used within a NotesProvider");
    return context;
};


