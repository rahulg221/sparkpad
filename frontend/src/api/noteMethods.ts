import { supabase } from './supabaseClient';
import { Note } from '../models/noteModel';

export const addNote = async (note: Note) => {
  try {
    const { data, error } = await supabase
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

    if (error) {
      throw error;
    }

    console.log('Note added:', data[0]);
    return data[0];
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    console.log('Fetched notes:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNotesByCluster = async (userId: string, cluster: number): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('cluster', cluster)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    console.log('Fetched notes by cluster:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching notes by cluster:', error);
    throw error;
  }
};

export const groupAndLabelNotes = async (notes: Note[]): Promise<Note[]> => {
  try {
    // Call clustering service
    const response = await fetch('http://127.0.0.1:8000/label', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

    console.log('Notes clustered:', clusteredNotes);
    return clusteredNotes;

  } catch (error) {
    console.error('Error clustering notes:', error);
    throw error;
  }
};
