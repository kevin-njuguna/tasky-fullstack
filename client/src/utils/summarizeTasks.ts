import type { Task } from '../pages/TasksPage';

export const summarizeTasks = async (tasks: Task[]) => {
  const prompt = `Summarize these tasks:\n${tasks
    .map(task => `- ${task.title}: ${task.description}`)
    .join('\n')}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || 'OpenAI error');

  return data.choices[0].message.content;
};
