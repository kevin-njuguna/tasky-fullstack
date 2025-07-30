// checkEmailAndUsernameReuse.ts

import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../controllers/auth.controllers"; // ← import the extended Request type

const client = new PrismaClient();

export default async function checkEmailAndUsernameReuse(
  req: AuthRequest, // ← use the extended type here
  res: Response,
  next: NextFunction,
) {
  const { email, username } = req.body;
  const userId = req.user?.id;

  const userWithUsername = await client.user.findFirst({
    where: {
      username,
      NOT: { id: userId },
    },
  });

  if (userWithUsername) {
    return res.status(400).json({ message: "Username already in use!" });
  }

  const userWithEmail = await client.user.findFirst({
    where: {
      email,
      NOT: { id: userId },
    },
  });

  if (userWithEmail) {
    return res.status(400).json({ message: "Email already in use!" });
  }

  next();
}
