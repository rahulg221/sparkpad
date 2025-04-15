import { supabase, getToken } from './supabaseClient';
import { Note } from '../models/noteModel';
import CalendarMethods from './calendarService';
import { useActions } from '../context/ActionsContext';

const API_URL = import.meta.env.VITE_API_URL;

export class NoteService {      
  static async getMostRecentNotes(userId: string, k: number = 5): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
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

  static async addNote(note: Note): Promise<string> {
    const token = await getToken();
    // Initialize notification message and OpenAI client
    let notificationMessage = 'Include a date or time in your note to create a calendar event or task';

    if (NoteService.containsDateTime(note.content) && note.content.startsWith('/e')) {
      notificationMessage = await CalendarMethods.createCalendarEvent(note.content);

      return notificationMessage;
    } else if (NoteService.containsDateTime(note.content) && note.content.startsWith('/t')) {
      notificationMessage = await CalendarMethods.createCalendarTask(note.content);

      return notificationMessage;
    } else if (!(NoteService.containsDateTime(note.content) && (note.content.startsWith('/e') || note.content.startsWith('/t')))) {
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
  
        notificationMessage = 'Successfully added note!';
      } catch (error) {
        notificationMessage = 'Failed to add note';
      }
    }

    return notificationMessage;
  }

  static async deleteNote(noteId: string): Promise<string> {
    try {
      await supabase.from('notes').delete().eq('id', noteId);
      return 'Successfully deleted note!';
    } catch {
      return 'Failed to delete note';
    }
  }

  static async getNotes(userId: string, limit?: number): Promise<Note[]> {
    try {
      if (!limit) {
        const { data } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        return data || [];
      } else {
        const { data } = await supabase
          .from('notes')
          .select('*')
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

  static async groupAndLabelNotes(notes: Note[]): Promise<void> {
    const token = await getToken();
    try {
      const response = await fetch(`${API_URL}/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes_content: notes.map(note => note.content), notes: notes }),
      });

      if (response.status === 429) {
        const errorData = await response.json();
        //alert(errorData.detail || "Rate limit for this action has been exceeded. Try again later.");
        return;
      }

      if (!response.ok) {
          throw new Error('Clustering service request failed');
      }
    } catch (error) {
      console.error('Failed to group and label notes:', error);
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
        .select('*', { count: 'exact', head: true })
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
        .select('*', { count: 'exact', head: true })
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
