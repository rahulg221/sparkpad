import { supabase, getToken } from './supabaseClient';
import { Note } from '../models/noteModel';
import CalendarMethods from './calendarService';
import { UserService } from './userService';
const API_URL = import.meta.env.VITE_API_URL;

export class NoteService {    
  static async createCustomNotepad(userId: string, label: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('custom_notepads')
        .insert([{ user_id: userId, label }])
        .select();

      if (error) {
        throw error;
      }

      return;
    } catch (error) {
      console.error('Failed to create custom notepad:', error);
      return;
    }
  }

  static async getMostRecentNotes(userId: string, k: number = 5): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id, content, category, created_at, user_id, cluster')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(k);

      if (error) {
        console.error('Error fetching recent notes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get most recent notes:', error);
      return [];
    }
  }

  static async addNote(note: Note, dateTimeString?: string, content?: string): Promise<string> {
    const token = await getToken();
    // Initialize notification message and OpenAI client
    let notificationMessage = 'Include a date or time in your note to create a calendar event or task';

    if (dateTimeString && note.content.startsWith('/e')) {
      notificationMessage = await CalendarMethods.createCalendarEvent(content!, dateTimeString); // content is from dateParse.ts
      console.log(notificationMessage);
      return notificationMessage;
    } else if (note.content.startsWith('/t')) {
      notificationMessage = await CalendarMethods.createCalendarTask(note.content);

      return notificationMessage;
    } else if (!((note.content.startsWith('/e') || note.content.startsWith('/t')) || note.content.startsWith('/c'))) {
      try {
        const response = await fetch(`${API_URL}/embed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({id: note.id, content: note.content }),
        });
    
        const embedding = await response.json();
        const embeddingData = embedding.embedding;

        await supabase
          .from('notes')
          .insert([
            {
              content: note.content,
              category: note.category,
              cluster: note.cluster,
              user_id: note.user_id,
              embedding: embeddingData,
            },
          ])
          .select();

        console.log('success');
  
        notificationMessage = 'Spark Captured!';
      } catch (error) {
        notificationMessage = 'Failed to capture Spark';
      }
    }

    return notificationMessage;
  }

  static async deleteNote(noteId: string, userId: string, lockedCategories: string[]): Promise<string> {
    try {
      // Store the note category before deleting
      const { data } = await supabase
        .from('notes')
        .select('category')
        .eq('id', noteId)
        .single();
      
      const noteCategory = data?.category;

      await supabase.from('notes').delete().eq('id', noteId);

      // Check if the category has any remaining notes after deletion
      const { count } = await supabase
        .from('notes')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('category', noteCategory);
      
      // If this was the last note in the category, we might want to handle that
      const isLastNoteInCategory = count === 0;

      if (isLastNoteInCategory) {
        await UserService.updateLockedCategory(userId, noteCategory, lockedCategories);
      }

      return 'Successfully deleted note!';
    } catch {
      return 'Failed to delete note';
    }
  }

  static async updateNote(noteId: string, category: string): Promise<string> {
    try {
      await supabase.from('notes').update({ category }).eq('id', noteId);
      return 'Successfully updated note!';
    } catch {
      return 'Failed to update note';
    }
  }

  static async getNotes(userId: string, limit?: number): Promise<Note[]> {
    try {
      if (!limit) {
        const { data } = await supabase
          .from('notes')
          .select('id, content, category, created_at, user_id, cluster')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        return data || [];
      } else {
        const { data } = await supabase
          .from('notes')
          .select('id, content, category, created_at, user_id, cluster')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(limit);

        return data || [];
      }
    } catch (error) {
      console.error('Failed to get notes:', error);
      return [];
    }
  }

  static async getDailyNotes(userId: string): Promise<Note[]> {
    const today = new Date();
    const est = new Date(today.toLocaleString('en-US', { timeZone: 'America/New_York' }));

    // Start of today in EST
    est.setHours(0, 0, 0, 0);
    const startOfDay = new Date(est);

    // End of today in EST
    const endOfDay = new Date(est);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
      .order('created_at', { ascending: false });

    return data || [];
    } catch (error) {
      console.error('Failed to get daily notes:', error);
      return [];
    }
  }

  static async summarizeNotes(notes: Note[]): Promise<string> {
    const token = await getToken();

    try { 
      const response = await fetch(`${API_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,   
        },
        body: JSON.stringify({ notes_content: notes.map(note => note.content), notes: notes }),
      });

      if (!response.ok) {
        throw new Error('Summarization service request failed');
      } 

      const data = await response.json();

      const summary = data.summary;

      return summary;
    } catch (error) {
      console.error('Failed to summarize notes:', error);
      return '';
    }
  }
  
  static async getNotesByCluster(userId: string, cluster: number): Promise<Note[]> {
    try {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('cluster', cluster)
        .order('created_at', { ascending: true });

      return data || [];
    } catch (error) {
      console.error('Failed to get notes by cluster:', error);
      return [];
    }
  }

  static async getNotesByCategory(userId: string, category: string, limit: number, offset: number): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id, content, category, created_at, user_id, cluster')
        .eq('user_id', userId)
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get notes by category:', error);
      return [];
    }
  }

  static async getUnlockedNotes(userId: string, lockedCategories: string[]): Promise<Note[]> {
    try {
      const noteQuery = supabase
        .from('notes')
        .select('id, content, category, created_at, user_id, cluster')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
  
      if (lockedCategories.length > 0) {
        noteQuery.not('category', 'in', `(${lockedCategories.map((cat: string) => `"${cat}"`).join(',')})`);
      }
  
      const { data: notes, error: notesError } = await noteQuery;
      if (notesError) throw notesError;
  
      return notes || [];
    } catch (error) {
      console.error('Failed to get unlocked notes:', error);
      return [];
    }
  }
  
  static async revertChanges(notes: Note[]): Promise<void> {
    try {
      if (!notes.length) return;  // no rollback needed
      const { error } = await supabase.from('notes').upsert(notes);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to revert changes:', error);
    }
  }  

  static async groupAndLabelNotes(): Promise<{ sorting_updates: string[], clustered_updates: string[] }> {
    const token = await getToken();
    try {
      const response = await fetch(`${API_URL}/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 429) {
        const errorData = await response.json();
        //alert(errorData.detail || "Rate limit for this action has been exceeded. Try again later.");
        return { sorting_updates: [], clustered_updates: [] };
      }

      if (!response.ok) {
          throw new Error('Clustering service request failed');
      }

      return { sorting_updates: data.sorting_updates, clustered_updates: data.clustered_updates };
    } catch (error) {
      console.error('Failed to group and label notes:', error);
      return { sorting_updates: [], clustered_updates: [] };
    }
  }

  static async searchNotes(userId: string, searchQuery: string): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .ilike('content', `%${searchQuery}%`)
        .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

      return data || [];
    } catch (error) {
      console.error('Failed to search notes:', error);
      return [];
    }
  }

  static async semanticSearch(searchQuery: string): Promise<Note[]> {
    const token = await getToken();

    try {
      const response = await fetch(`${API_URL}/semantic_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: searchQuery }),
      }); 

      if (response.status === 429) {
        const errorData = await response.json();
        alert(errorData.detail || "Rate limit for this action has been exceeded. Try again later.");
        return [];
      }

      if (!response.ok) {
        throw new Error('Semantic search service request failed');
      }

      const data = await response.json();
      console.log("data", data);
      return data || [];
    } catch (error) {
      console.error('Failed to semantic search:', error);
      return [];
    }
  }

  static async getNotesCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return count || 0;
    } catch (error) {
      console.error('Failed to get notes count:', error);
      return 0;
    }
  }

  static async getNotesCountByCategory(userId: string, category: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('notes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('category', category);

    return count || 0;
    } catch (error) {
      console.error('Failed to get notes count by category:', error);
      return 0;
    }
  }

  private static containsDateTime(content: string): boolean {
    const patterns = [
      /\b(today|tomorrow|yesterday)\b/i,
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
      /\b(morning|afternoon|evening|night|noon|midnight)\b/i,
      /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i,
      /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/,
      /\b(next|last|this)\s+(week|month|year)\b/i,
      /\b(now|later|soon|recently|earlier)\b/i,
    ];
    return patterns.some(pattern => pattern.test(content));
  }

  static async getDistinctCategories(userId: string): Promise<string[]> {
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
}
