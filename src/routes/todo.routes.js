import { Router } from "express";
import { createTask, getTasks, getTasksById, updateTask, deleteTask } from "../controllers/todo.controllers.js";

const router = Router();

router.post("/", createTask);          
router.get("/:userId", getTasks);      
router.get("/task/:id", getTasksById); 
router.put("/:id", updateTask);        
router.delete("/:id", deleteTask);    

export default router;
