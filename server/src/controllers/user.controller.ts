import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthRequest } from "./auth.controllers";
//import cloudinary from "../utils/cloudinary";

const client = new PrismaClient();


export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await client.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        avatar: true,
        dateJoined: true,
        lastProfileUpdate: true,
      },
    });

    res.json(user);
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, username } = req.body;

  try {
    const updated = await client.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName, email, username },
    });

    res.json({ message: "Profile updated", user: updated });
  } catch {
    res.status(500).json({ message: "Failed to update profile" });
  }
};


export const updatePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await client.user.findUnique({ where: { id: req.user.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong current password" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await client.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    res.json({ message: "Password updated successfully" });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: "avatarUrl is required" });
    }

    const updated = await client.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl },
    });

    res.json({ message: "Avatar updated successfully", avatar: updated.avatar });
  } catch (e) {
    res.status(500).json({ message: "Failed to update avatar" });
  }
};
