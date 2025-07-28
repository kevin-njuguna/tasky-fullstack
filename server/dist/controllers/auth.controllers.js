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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
exports.authenticate = authenticate;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new client_1.PrismaClient();
const register = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { firstName, lastName, email, username, password } = req.body;
      const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
      const users = yield client.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
        },
      });
      return res.status(201).json("User created succesfully");
    } catch (e) {
      console.log(e);
      return res.status(400).json("Something went wrong");
    }
  });
exports.register = register;
const login = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { identifier, password } = req.body;
      const user = yield client.user.findFirst({
        where: {
          OR: [{ username: identifier }, { email: identifier }],
        },
      });
      if (!user) {
        res.status(400).json({ message: "Failed. Wrong login credentials" });
        return;
      }
      const passwordMatch = yield bcryptjs_1.default.compare(
        password,
        user.password,
      );
      if (!passwordMatch) {
        res.status(400).json({ message: "Failed. Wrong login credentials!" });
      }
      const { password: loginPassword, dateJoined, lastProfileUpdate } = user,
        userDetails = __rest(user, [
          "password",
          "dateJoined",
          "lastProfileUpdate",
        ]);
      const token = jsonwebtoken_1.default.sign(
        userDetails,
        process.env.JWT_SECRET,
      );
      // Send token and user details as response
      res.cookie("authToken", token).json(userDetails);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong!" });
    }
  });
exports.login = login;
const logout = (_req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logged out succesfully!" });
};
exports.logout = logout;
function authenticate(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(400).json({ message: "Unauthorized!" });
  }
  try {
    const decoded = jsonwebtoken_1.default.verify(
      token,
      process.env.JWT_SECRET,
    );
    req.user = decoded;
    next();
  } catch (_a) {
    res.status(401).json({ message: "Invalid token" });
  }
}
