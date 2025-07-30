// src/controllers/summarize.controller.ts
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'; 

dotenv.config(); 


const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please set it in your environment variables on Render and locally in a .env file.");
 
}


const genAI = new GoogleGenerativeAI(API_KEY || '');

export const summarizeTasks = async (req: Request, res: Response) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    console.error("Invalid or empty tasks payload:", tasks);
    return res.status(400).json({ error: "Tasks must be a non-empty array" });
  }

  try {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or "gemini-1.5-pro"

   
    const formattedTasks = tasks.map((task: any, i: number) => {
      const statusText = task.isCompleted ? "Completed" : "Incomplete"; // Assuming frontend sends `isCompleted`
      return `${i + 1}. Status: ${statusText}, Title: "${task.title}", Description: "${task.description}"`;
    }).join("\n");

    const prompt = `Please provide a concise summary of the following tasks.
    Categorize them by their status (e.g., Incomplete).
    Highlight the main themes or recurring action items.

    Tasks:
    ${formattedTasks}

    Provide the summary in a readable paragraph or bullet point format.
    `;

    console.log("Sending prompt to Gemini:", prompt); // Log the prompt being sent

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text(); 
    return res.status(200).json({ summary });

  } catch (error: any) {
    console.error("Gemini API error:", error?.message || error);

  
    if (error.status && error.status === 400) {
      
      return res.status(400).json({ error: "Bad request to Gemini API. Check prompt or API key." });
    }
    if (error.status && error.status === 429) {
      
      return res.status(429).json({ error: "Too many requests to Gemini API. Please try again later." });
    }
    if (error.status && error.status >= 500) {
      
      return res.status(502).json({ error: "Gemini API is currently unavailable. Please try again later." });
    }

    return res.status(500).json({ error: "Failed to generate summary due to an unexpected error." });
  }
};