import { createContext, ReactNode, useContext, useState } from "react";
import { NoteService } from "../api/noteService";
import { useNotes } from "./NotesProvider";
import { useAuth } from "./AuthProvider";

type SummaryContextType = {
  summary: string;
  isSummaryLoading: boolean;
  isSummaryVisible: boolean;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  setIsSummaryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSummaryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  createSummary: () => Promise<void>;
};

export const SummaryContext = createContext<SummaryContextType | null>(null);

export const SummaryProvider = ({ children }: { children: ReactNode }) => {
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const { user } = useAuth();
  const { currentCategory } = useNotes();

  const createSummary = async () => {
    let notesToSummarize = [];
    setIsSummaryLoading(true);

    try {
      if (!user) throw new Error('User not found');

      notesToSummarize =
        currentCategory === ''
          ? await NoteService.getNotes(user.id!, 25)
          : await NoteService.getNotesByCategory(user.id!, currentCategory, 25, 0);

      const result = await NoteService.summarizeNotes(notesToSummarize);
      setSummary(result);
    } catch (err) {
      console.error('Error summarizing notes:', err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <SummaryContext.Provider
      value={{
        summary,
        isSummaryLoading,
        isSummaryVisible,
        setSummary,
        setIsSummaryLoading,
        setIsSummaryVisible,
        createSummary,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  return context;
};
