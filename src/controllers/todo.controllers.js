import { Todo } from "../models/to-do.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
const createTask = asyncHandler(async (req, res) => {
  const { title, priority, status, userId, dueDate } = req.body;
  if (!title || !userId) {
        throw new ApiError(400, "Title and userId are required");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid userId format");
    }
    if (dueDate && new Date(dueDate) < new Date()) {
        throw new ApiError(400, "Due date cannot be in the past");
    }
  const task = await Todo.create({ title, priority, status, userId, dueDate :dueDate ? new Date(dueDate) : undefined});

  return res.status(201).json(new ApiResponse(201, task, "Task added"));
});

const getTasks = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const tasks = await Todo.find({ userId });
if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid userId format");
    }
  return res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched"));
});

const getTasksById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID format");
    }
  const task = await Todo.findById(id);

  if (!task) {
    return res.status(404).json(new ApiResponse(404, null, "No Task found"));
  }
  return res.status(200).json(new ApiResponse(200, task, "Task fetched"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID format");
    }

  const task = await Todo.findByIdAndUpdate(id, { $set: updates }, { new: true });

  if (!task) {
    return res.status(404).json(new ApiResponse(404, null, "Task not found"));
  }
  return res.status(200).json(new ApiResponse(200, task, "Task updated"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID format");
    }
  const task = await Todo.findByIdAndDelete(id);

  if (!task) {
    return res.status(404).json(new ApiResponse(404, null, "Task not found"));
  }
  return res.status(200).json(new ApiResponse(200, null, "Task deleted"));
});

export { createTask, getTasks, getTasksById, updateTask, deleteTask };
