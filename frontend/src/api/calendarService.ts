import { getToken } from './supabaseClient';
const API_URL = import.meta.env.VITE_API_URL;

export class CalendarService {
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
        notificationMessage = 'Calendar event created';
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

      if (!response.ok) {
        notificationMessage = 'Failed to create calendar task';
      } else {
        notificationMessage = 'Calendar task created';
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
}

export default CalendarService;
