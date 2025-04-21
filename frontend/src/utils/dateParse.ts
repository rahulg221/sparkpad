// chronoUtils.ts
export async function extractDateAndText(input: string): Promise<{ dateTimeString?: string, hint: string, content: string }> {
    const { parse } = await import('chrono-node');
    const results = parse(input);
  
    if (results.length === 0) return { content: input, hint: '' };
  
    const parsedResults = results[0];

    const date = parsedResults.start.date();

    const hint = date.toLocaleString('en-US', {
        month: 'short',
        weekday: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const dateTimeString = date.toISOString();

    const content = input.replace(parsedResults.text, '').trim();

    return { dateTimeString, hint, content };
  }
  