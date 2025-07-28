import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import taskRouter from "./routes/task.route";
import userRouter from "./routes/user.route";

import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.json({ limit: '5mb' })); 
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.get("/", (_req, res) => {
  res.send("<h1>Welcome to Taskys!</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});

app.use("/api/user", userRouter);
