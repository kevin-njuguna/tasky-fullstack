import zxcvbn from "zxcvbn";
import { Request, Response, NextFunction } from "express";

export default function checkPasswordStrength(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const password = req.body.newPassword || req.body.password;

  if (!password) {
    return res.status(400).json({ message: "Password is required!" });
  }

  const result = zxcvbn(password);

  if (result.score < 3) {
    return res.status(400).json({ message: "Please pick a stronger password!" });
  }

  next();
}
