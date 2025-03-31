import { token } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

export class CalendarService {
  static async createCalendarEvent(text: string): Promise<string> {
    let notificationMessage = '';

    const response = await fetch(`${API_URL}/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ note: text }),
    });

    if (!response.ok) {
      notificationMessage = 'Failed to create calendar event';
    } else {
      notificationMessage = 'Calendar event created';
    }

    return notificationMessage;
  }

  static async createCalendarTask(text: string): Promise<string> {
    let notificationMessage = '';

    const response = await fetch(`${API_URL}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ note: text }),
    });

    if (!response.ok) {
      notificationMessage = 'Failed to create calendar task';
    } else {
      notificationMessage = 'Calendar task created';
    }

    return notificationMessage;
  }

  static async getCalendarEvents(): Promise<string[]> {
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
  }

  static async getGoogleAuthUrl(): Promise<string> {
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
  }

  static async sendAuthCodeToBackend(code: string): Promise<any> {
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
  }
}

export default CalendarService;
