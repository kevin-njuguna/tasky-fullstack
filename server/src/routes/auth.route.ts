import { Router } from "express";
import { register } from "../controllers/auth.controllers";
import verifyUserInformation from "../middlewares/verifyUserInformation";
import checkPasswordStrength from "../middlewares/checkPasswordStrength";
import checkEmailAndUsernameReuse from "../middlewares/checkEmailAndUsernameReuse";
import { login } from "../controllers/auth.controllers";
import { logout } from "../controllers/auth.controllers";

const router: Router = Router();

router.post(
  "/register",
  verifyUserInformation,
  checkEmailAndUsernameReuse,
  checkPasswordStrength,
  register,
);
router.post("/login", login);
router.post("/logout", logout);

export default router;
