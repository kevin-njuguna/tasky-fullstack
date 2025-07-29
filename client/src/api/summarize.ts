import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tasks } = req.body;

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Tasks must be an array' });
  }

  try {
    const prompt = `Summarize the following user tasks:\n\n${tasks
      .map((task: any, index: number) => `${index + 1}. ${task.title} - ${task.description}`)
      .join('\n')}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const summary = response.choices[0]?.message?.content || 'No summary returned.';
    res.status(200).json({ summary });
  } catch (error: any) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
}
