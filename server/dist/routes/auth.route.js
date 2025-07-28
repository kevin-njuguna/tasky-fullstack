"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const verifyUserInformation_1 = __importDefault(
  require("../middlewares/verifyUserInformation"),
);
const checkPasswordStrength_1 = __importDefault(
  require("../middlewares/checkPasswordStrength"),
);
const checkEmailAndUsernameReuse_1 = __importDefault(
  require("../middlewares/checkEmailAndUsernameReuse"),
);
const auth_controllers_2 = require("../controllers/auth.controllers");
const auth_controllers_3 = require("../controllers/auth.controllers");
const router = (0, express_1.Router)();
router.post(
  "/register",
  verifyUserInformation_1.default,
  checkEmailAndUsernameReuse_1.default,
  checkPasswordStrength_1.default,
  auth_controllers_1.register,
);
router.post("/login", auth_controllers_2.login);
router.post("/logout", auth_controllers_3.logout);
exports.default = router;
