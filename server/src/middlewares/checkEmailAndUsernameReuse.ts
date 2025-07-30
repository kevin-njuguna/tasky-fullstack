import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default async function checkEmailAndUsernameReuse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, username } = req.body;

  const userWithUsername = await client.user.findFirst({
    where: { username },
  });

  if (userWithUsername) {
  return res.status(400).json({ message: "Username already in use!" });
 }

  const userWithEmail = await client.user.findFirst({
    where: { email },
  });

  if (userWithEmail) {
    
  return res.status(400).json({ message: "Email already in use!" });
}
  next();
}
