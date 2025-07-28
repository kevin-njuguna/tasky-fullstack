"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar =
  exports.updatePassword =
  exports.updateProfile =
  exports.getProfile =
    void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//import cloudinary from "../utils/cloudinary";
const client = new client_1.PrismaClient();
const getProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const user = yield client.user.findUnique({
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
    } catch (_a) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
exports.getProfile = getProfile;
const updateProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, username } = req.body;
    try {
      const updated = yield client.user.update({
        where: { id: req.user.id },
        data: { firstName, lastName, email, username },
      });
      res.json({ message: "Profile updated", user: updated });
    } catch (_a) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
exports.updateProfile = updateProfile;
const updatePassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    try {
      const user = yield client.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ message: "User not found" });
      const isMatch = yield bcryptjs_1.default.compare(
        currentPassword,
        user.password,
      );
      if (!isMatch)
        return res.status(400).json({ message: "Wrong current password" });
      const hashed = yield bcryptjs_1.default.hash(newPassword, 10);
      yield client.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });
      res.json({ message: "Password updated successfully" });
    } catch (_a) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
exports.updatePassword = updatePassword;
const uploadAvatar = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { avatarUrl } = req.body;
      if (!avatarUrl) {
        return res.status(400).json({ message: "avatarUrl is required" });
      }
      const updated = yield client.user.update({
        where: { id: req.user.id },
        data: { avatar: avatarUrl },
      });
      res.json({
        message: "Avatar updated successfully",
        avatar: updated.avatar,
      });
    } catch (e) {
      res.status(500).json({ message: "Failed to update avatar" });
    }
  });
exports.uploadAvatar = uploadAvatar;
