import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeTasks = async (req: Request, res: Response) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks)) {
    console.error("Invalid tasks payload:", tasks);
    return res.status(400).json({ error: "Tasks must be an array" });
  }

  const prompt = `Summarize the following user tasks:\n\n${tasks
    .map((task: any, i: number) => `${i + 1}. ${task.title} - ${task.description}`)
    .join("\n")}`;

  try {
    console.log("Sending prompt to OpenAI:", prompt); // log this!
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = response.choices[0]?.message?.content ?? "No summary generated.";
    return res.status(200).json({ summary });
  } catch (error: any) {
    console.error("OpenAI error:", error?.response?.data || error?.message || error);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
};
