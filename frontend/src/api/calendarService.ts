import { getToken, supabase } from './supabaseClient';
const API_URL = import.meta.env.VITE_API_URL;

export class CalendarService {
  static async checkCalendarAccess(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('google_connected')
      .eq('id', userId)
      .maybeSingle();
  
    if (error) {
      console.error('Error checking calendar access:', error);
      return false;
    }
    
    return data?.google_connected === true;
  }  

  static async createCalendarEvent(text: string): Promise<string> {
    const token = await getToken();
    let notificationMessage = '';

    try { 
      const response = await fetch(`${API_URL}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ note_content: text }),
      });

      if (!response.ok) {
        notificationMessage = 'Failed to create calendar event';
      } else {
        notificationMessage = `'${text.substring(3)}' has been added to your Google Calendar`;
      }

      return notificationMessage;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      throw error;
    }
  }

  static async createCalendarTask(text: string): Promise<string> {
    const token = await getToken();
    let notificationMessage = '';

    try { 
      const response = await fetch(`${API_URL}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ note_content: text }),
      });

      // Remove /e or /t from the beginning of the text if present
      let newText = text;
      if (text.startsWith('/e ') || text.startsWith('/t ')) {
        newText = text.substring(3);
      }

      if (!response.ok) {
        notificationMessage = 'Failed to create calendar task';
      } else {
        notificationMessage = `'${newText}' has been added to your Google Tasks`;
      }

      return notificationMessage;
    } catch (error) {
      console.error('Failed to create calendar task:', error);
      throw error;
    }
  }

  static async getCalendarEvents(): Promise<string[]> {
    const token = await getToken();

    try {
      const response = await fetch(`${API_URL}/getevents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get calendar events');
      }   

      const data = await response.json(); 

      return data.events;
    } catch (error) {
      console.error('Failed to get calendar events:', error);
      throw error;
    }
  }

  static async getGoogleAuthUrl(): Promise<string> {  
    const token = await getToken();

    try {
      const response = await fetch(`${API_URL}/auth/google/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }); 

      if (!response.ok) {
        throw new Error('Failed to get Google auth URL');
      }

      const data = await response.json();

      const googleAuthUrl = data.url;

      return googleAuthUrl;
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      throw error;
    }
  }

  static async sendAuthCodeToBackend(code: string): Promise<any> {
    const token = await getToken();

    try {
      const response = await fetch(`${API_URL}/auth/google/callback?code=${code}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth callback failed: ${errorText}`);
      }

      return response.json(); 
    } catch (error) {
      console.error('Failed to send auth code to backend:', error);
      throw error;
    }
  }

  static async getTasks(): Promise<string[]> {
    const token = await getToken();
    
    try {
      const response = await fetch(`${API_URL}/gettasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get tasks');
      }

      const data = await response.json();
  
      return data.tasks;
    } catch (error) {
      console.error('Failed to get tasks:', error);
      throw error;
    }
  }
}

export default CalendarService;
