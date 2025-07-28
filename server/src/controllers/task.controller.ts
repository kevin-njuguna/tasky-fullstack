import {Request, Response} from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from './auth.controllers'

const client = new PrismaClient()

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const task = await client.task.create({
      data: {
        title,
        description,
        authorId: req.user.id,
      },
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await client.task.findMany({
      where: {
        authorId: req.user?.id,
        isDeleted: false,
        isCompleted: false,
      },
      orderBy: {
        dateCreated: "desc",
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getTaskById = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  try {
    const task = await client.task.findFirst({
      where: {
        id: taskId,
        authorId: req.user?.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const updateTask = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { title, description } = req.body;

  try {
    const task = await client.task.updateMany({
      where: {
        id: taskId,
        authorId: req.user?.id,
      },
      data: {
        title,
        description,
      },
    });

    if (task.count === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task updated successfully" });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;

  try {
    const updated = await client.task.updateMany({
      where: {
        id: taskId,
        authorId: req.user?.id,
      },
      data: { isDeleted: true },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task moved to trash" });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getDeletedTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await client.task.findMany({
      where: {
        authorId: req.user?.id,
        isDeleted: true,
      },
      orderBy: {
        dateCreated: "desc",
      },
    });

    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch deleted tasks" });
  }
};


export const markTaskComplete = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  try {
    await client.task.updateMany({
      where: { id: taskId, authorId: req.user?.id },
      data: { isCompleted: true },
    });
    res.json({ message: "Task marked as complete" });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const markTaskIncomplete = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  try {
    await client.task.updateMany({
      where: { id: taskId, authorId: req.user?.id },
      data: { isCompleted: false },
    });
    res.json({ message: "Task marked as incomplete" });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getIncompleteTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const tasks = await client.task.findMany({
      where: {
        authorId: userId, 
        isCompleted: false,
        isDeleted: false,
      },
      orderBy: { dateCreated: "desc" },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Failed to fetch incomplete tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompletedTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user found in token." });
    }

    const completedTasks = await client.task.findMany({
      where: {
        authorId: userId,
        isCompleted: true,
        isDeleted: false,
      },
      orderBy: {
        dateCreated: "desc",
      },
    });

    return res.status(200).json(completedTasks);
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const restoreTask = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  try {
    await client.task.updateMany({
      where: { id: taskId, authorId: req.user?.id },
      data: { isDeleted: false },
    });
    res.json({ message: "Task restored successfully" });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};
