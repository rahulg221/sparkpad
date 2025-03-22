export const createCalendarEvent = async (text: string): Promise<void> => {
    const response = await fetch('http://127.0.0.1:8000/calendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error('Failed to create calendar event');
    }

    const data = await response.json();
    console.log('Calendar event created:', data);
}
