import zxcvbn from "zxcvbn";
import { Request, Response, NextFunction } from "express";

export default function checkPasswordStrength(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { password } = req.body;

  const result = zxcvbn(password);

  if (result.score < 3) {
    res.status(400).json({ message: "Please pick a stronger password!" });
    return;
  }
  next();
}
