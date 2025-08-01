import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
} from "../controllers/user.controller";
import { authenticate } from "../controllers/auth.controllers";
import checkPasswordStrength from "../middlewares/checkPasswordStrength";
import checkEmailAndUsernameReuse from "../middlewares/checkEmailAndUsernameReuse";

const router: Router = Router();

router.get("/", authenticate, getProfile);
router.patch("/", authenticate, checkEmailAndUsernameReuse, updateProfile);
router.patch("/avatar", authenticate, uploadAvatar);
router.patch("/password", authenticate, checkPasswordStrength, updatePassword);

export default router;
