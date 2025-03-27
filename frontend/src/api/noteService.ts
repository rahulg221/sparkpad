import { supabase, token } from './supabaseClient';
import { Note } from '../models/noteModel';
import { jsPDF } from 'jspdf';
import CalendarMethods from './calendarService';

export class NoteService {
  static async addNote(note: Note): Promise<string> {
    let notificationMessage = '';

    try {
      await supabase
        .from('notes')
        .insert([
          {
            content: note.content,
            category: note.category,
            cluster: note.cluster,
            user_id: note.user_id,
          },
        ])
        .select();

      notificationMessage = 'Successfully added note!';

      if (this.containsDateTime(note.content) && note.content[0] === '/') {
        notificationMessage = await CalendarMethods.createCalendarEvent(note.content);
      }
    } catch (error) {
      notificationMessage = 'Failed to add note';
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

  static async getNotes(userId: string): Promise<Note[]> {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    return data || [];
  }

  static async getWeeklyNotes(userId: string): Promise<Note[]> {
    const today = new Date();
    const est = new Date(today.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    est.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(est);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .lt('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  }

  static async summarizeWeeklyNotes(userId: string): Promise<string> {
    const notes = await this.getWeeklyNotes(userId);

    const response = await fetch('http://127.0.0.1:8000/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes: notes.map(note => note.content) }),
    });

    if (!response.ok) {
      throw new Error('Summarization service request failed');
    }

    const summary = await response.json();

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const usableWidth = pageWidth - margin * 2;

    doc.setFontSize(12);
    doc.text(summary.trim(), margin, 30, {
      maxWidth: usableWidth,
      align: 'left',
    });

    const today = new Date();
    doc.save(`${today.toISOString().split('T')[0]}_weekly_report.pdf`);

    return summary;
  }

  static async getNotesByCluster(userId: string, cluster: number): Promise<Note[]> {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('cluster', cluster)
      .order('created_at', { ascending: true });

    return data || [];
  }

  static async getNotesByCategory(userId: string, category: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  static async groupAndLabelNotes(notes: Note[]): Promise<Note[]> {
    const response = await fetch('http://127.0.0.1:8000/label', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes: notes.map(note => note.content) }),
    });

    if (!response.ok) {
      throw new Error('Clustering service request failed');
    }

    const clusteringResult = await response.json();

    const clusteredNotes: Note[] = clusteringResult.clusters.map((result: any, index: number) => ({
      id: notes[index].id,
      content: result.Note,
      category: result.Category,
      cluster: result.Cluster,
      user_id: notes[index].user_id,
      created_at: undefined,
      updated_at: undefined,
    }));

    for (const note of clusteredNotes) {
      const { error: noteUpdateError } = await supabase
        .from('notes')
        .update({
          category: note.category,
          cluster: note.cluster,
        })
        .eq('id', note.id);

      if (noteUpdateError) {
        throw noteUpdateError;
      }
    }

    return clusteredNotes;
  }

  static async searchNotes(userId: string, searchQuery: string): Promise<Note[]> {
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
  }

  static async getNotesCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return count || 0;
  }

  static async getNotesCountByCategory(userId: string, category: string): Promise<number> {
    const { count } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('category', category);

    return count || 0;
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
