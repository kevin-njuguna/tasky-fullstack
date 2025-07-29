import axiosInstance from "../api/axios"; 
import type { Task } from "../pages/TasksPage";

export const summarizeTasks = async (tasks: Task[]) => {
  try {
    const response = await axiosInstance.post("/api/summarize", {
      tasks: tasks.map(({ title, description }) => ({ title, description })),
    });
    return response.data.summary;
  } catch (err) {
    console.error("Failed to summarize tasks:", err);
    throw err;
  }
};
