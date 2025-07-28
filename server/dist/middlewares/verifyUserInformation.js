"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyUserInformation;
function verifyUserInformation(req, res, next) {
  const { firstName, lastName, email, password, username } = req.body;
  if (!firstName) {
    res.status(400).json("Firstname is required");
    return;
  }
  if (!lastName) {
    res.status(400).json("Lastname is required");
    return;
  }
  if (!email) {
    res.status(400).json("Email is required");
    return;
  }
  if (!password) {
    res.status(400).json("Password is required");
    return;
  }
  if (!username) {
    res.status(400).json("username is required");
    return;
  }
  next();
}
