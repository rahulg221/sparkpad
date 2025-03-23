import { supabase } from './supabaseClient';

const session = await supabase.auth.getSession();
const token = session.data.session?.access_token;

export const createCalendarEvent = async (text: string): Promise<string> => {
    let notificationMessage = '';

    const response = await fetch('http://127.0.0.1:8000/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: text })
    });

    if (!response.ok) {
        notificationMessage = 'Failed to create calendar event';
    } else {
        notificationMessage = 'Calendar event created';
    }
    
    return notificationMessage;
}
