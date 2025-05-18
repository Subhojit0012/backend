import express from "express";
import { authenticateUser, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblem, getProblem, getSolvedProblem, updateProblem } from "../controllers/problem.controller.js";

const problemRoute = express.Router();
// admin only
problemRoute.post("/create-problem", authenticateUser, checkAdmin, createProblem);
problemRoute.put("/update-problem/:id", authenticateUser, checkAdmin, updateProblem)
problemRoute.delete("/delete-problem/:id", authenticateUser, checkAdmin, deleteProblem)

// user 
problemRoute.get("/get-all-problems", authenticateUser, getAllProblem)
problemRoute.get("/get-problem/:id", authenticateUser, getProblem)
problemRoute.get("/get-solved-problem", authenticateUser, getSolvedProblem)


export default problemRoute;
