import axios from 'axios';
import type { Task } from '../pages/TasksPage'; 

export const summarizeTasks = async (tasks: Task[]) => {
  try {
    const response = await axios.post('/api/summarize', { tasks });
    return response.data.summary;
  } catch (err) {
    console.error('Failed to summarize tasks:', err);
    throw err;
  }
};
