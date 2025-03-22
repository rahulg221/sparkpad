import { supabase } from './supabaseClient';
import { Note } from '../models/noteModel';
import { createCalendarEvent } from './calendarMethods';
import { jsPDF } from 'jspdf';

const session = await supabase.auth.getSession();
const token = session.data.session?.access_token;

export const summarizeDailyNotes = async (userId: string): Promise<string> => {
  const notes = await getTodaysNotes(userId);

  try {
    const response = await fetch('http://127.0.0.1:8000/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ notes: notes.map(note => note.content) })
    });

    if (!response.ok) {
      throw new Error('Summarization service request failed');
    }

    const summary = await response.json();

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20; // mm
    const usableWidth = pageWidth - margin * 2;

    doc.setFontSize(12);
    doc.text(summary.trim(), margin, 30, {
      maxWidth: usableWidth,
      align: "left",
    });
    
    const today = new Date();
    doc.save(`${today.toISOString().split('T')[0]}_daily_report.pdf`);
      
    return summary;
  } catch (error) {
    throw error;
  }
}

export const getTodaysNotes = async (userId: string): Promise<Note[]> => {
  try {
    // Get current date in EST
    const today = new Date();
    const est = new Date(today.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    est.setHours(0, 0, 0, 0); // Start of day EST
    
    const tomorrow = new Date(est);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day EST

    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', est.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  } catch (error) {
    throw error;
  }
};

export const addNote = async (note: Note): Promise<string> => {
  let notificationMessage = '';

  try {
    await supabase
      .from('notes')
      .insert([
        {
          content: note.content,
          category: note.category,
          cluster: note.cluster,
          user_id: note.user_id
        }
      ])
      .select();

    notificationMessage = 'Successfully added note!'; 

    if (containsDateTime(note.content)) {
      notificationMessage = await createCalendarEvent(note.content);
    }
  } catch (error) {
    notificationMessage = 'Failed to add note';
  }

  return notificationMessage;
};

export const deleteNote = async (noteId: string): Promise<string> => {
  let notificationMessage = '';

  try {
    await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    notificationMessage = 'Successfully deleted note!';
  } catch (error) {
    notificationMessage = 'Failed to delete note';
  }

  return notificationMessage;
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  try {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    return data || [];
  } catch (error) {
    throw error;
  }
};

export const getNotesByCluster = async (userId: string, cluster: number): Promise<Note[]> => {
  try {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('cluster', cluster)
      .order('created_at', { ascending: true });

    return data || [];
  } catch (error) {
    throw error;
  }
};

export const getNotesByCategory = async (userId: string, category: string): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    throw error;
  }
};

export const groupAndLabelNotes = async (notes: Note[]): Promise<Note[]> => {
  try {
    // Call clustering service
    const response = await fetch('http://127.0.0.1:8000/label', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ notes: notes.map(note => note.content) })
    });

    if (!response.ok) {
      throw new Error('Clustering service request failed');
    }

    const clusteringResult = await response.json();

    // Map clustering results back to Note objects
    const clusteredNotes: Note[] = clusteringResult.clusters.map((result: any, index: number) => ({
      id: notes[index].id,
      content: result.Note,
      category: result.Category,
      cluster: result.Cluster,
      user_id: notes[index].user_id, 
      created_at: undefined,
      updated_at: undefined
    }));

    // Update all notes in the database with their new clusters and categories
    for (const note of clusteredNotes) {
      const { error: noteUpdateError } = await supabase
        .from('notes')
        .update({
          category: note.category,
          cluster: note.cluster
        })
        .eq('id', note.id);

      if (noteUpdateError) {
        throw noteUpdateError;
      }
    }

    return clusteredNotes;

  } catch (error) {
    throw error;
  }
};

export const getDistinctCategories = async (userId: string): Promise<string[]> => {
  try {
    const { data } = await supabase
      .from('notes')
      .select('category')
      .eq('user_id', userId)
      .not('category', 'eq', '')
      .not('category', 'is', null);

    // Extract unique categories
    const categories = [...new Set(data?.map(note => note.category))];
    return categories;

  } catch (error) {
    throw error;
  }
};

const containsDateTime = (content: string): boolean => {
  const patterns = [
    /\b(today|tomorrow|yesterday)\b/i,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
    /\b(morning|afternoon|evening|night|noon|midnight)\b/i,
    /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i,
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/,
    /\b(next|last|this)\s+(week|month|year)\b/i,
    /\b(now|later|soon|recently|earlier)\b/i
  ];
  return patterns.some(pattern => pattern.test(content));
};

// Add this new function to search notes
export const searchNotes = async (userId: string, searchQuery: string): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .ilike('content', `%${searchQuery}%`) // Case-insensitive search
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
};

export const getNotesCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error getting notes count:', error);
    throw error;
  }
};
