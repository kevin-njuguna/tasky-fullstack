"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreTask = exports.getCompletedTasks = exports.getIncompleteTasks = exports.markTaskIncomplete = exports.markTaskComplete = exports.getDeletedTasks = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res
                .status(400)
                .json({ message: "Title and description are required" });
        }
        const task = yield client.task.create({
            data: {
                title,
                description,
                authorId: req.user.id,
            },
        });
        res.status(201).json({ message: "Task created successfully", task });
    }
    catch (err) {
        console.error("Create task error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.createTask = createTask;
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tasks = yield client.task.findMany({
            where: {
                authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                isDeleted: false,
                isCompleted: false,
            },
            orderBy: {
                dateCreated: "desc",
            },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllTasks = getAllTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { taskId } = req.params;
    try {
        const task = yield client.task.findFirst({
            where: {
                id: taskId,
                authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getTaskById = getTaskById;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { taskId } = req.params;
    const { title, description } = req.body;
    try {
        const task = yield client.task.updateMany({
            where: {
                id: taskId,
                authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            data: {
                title,
                description,
            },
        });
        if (task.count === 0) {
            return res
                .status(404)
                .json({ message: "Task not found or unauthorized" });
        }
        res.json({ message: "Task updated successfully" });
    }
    catch (_b) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { taskId } = req.params;
    try {
        const updated = yield client.task.updateMany({
            where: {
                id: taskId,
                authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            },
            data: { isDeleted: true },
        });
        if (updated.count === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task moved to trash" });
    }
    catch (_b) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteTask = deleteTask;
const getDeletedTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tasks = yield client.task.findMany({
            where: {
                authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                isDeleted: true,
            },
            orderBy: {
                dateCreated: "desc",
            },
        });
        res.json(tasks);
    }
    catch (_b) {
        res.status(500).json({ message: "Failed to fetch deleted tasks" });
    }
});
exports.getDeletedTasks = getDeletedTasks;
const markTaskComplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { taskId } = req.params;
    try {
        yield client.task.updateMany({
            where: { id: taskId, authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
            data: { isCompleted: true },
        });
        res.json({ message: "Task marked as complete" });
    }
    catch (_b) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.markTaskComplete = markTaskComplete;
const markTaskIncomplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { taskId } = req.params;
    try {
        yield client.task.updateMany({
            where: { id: taskId, authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
            data: { isCompleted: false },
        });
        res.json({ message: "Task marked as incomplete" });
    }
    catch (_b) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.markTaskIncomplete = markTaskIncomplete;
const getIncompleteTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const tasks = yield client.task.findMany({
            where: {
                authorId: userId,
                isCompleted: false,
                isDeleted: false,
            },
            orderBy: { dateCreated: "desc" },
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error("Failed to fetch incomplete tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getIncompleteTasks = getIncompleteTasks;
const getCompletedTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: no user found in token." });
        }
        const completedTasks = yield client.task.findMany({
            where: {
                authorId: userId,
                isCompleted: true,
                isDeleted: false,
            },
            orderBy: {
                dateCreated: "desc",
            },
        });
        return res.status(200).json(completedTasks);
    }
    catch (error) {
        console.error("Error fetching completed tasks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCompletedTasks = getCompletedTasks;
const restoreTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { taskId } = req.params;
    try {
        yield client.task.updateMany({
            where: { id: taskId, authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
            data: { isDeleted: false },
        });
        res.json({ message: "Task restored successfully" });
    }
    catch (_b) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.restoreTask = restoreTask;
