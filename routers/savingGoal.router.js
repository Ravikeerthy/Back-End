import express from "express";
import {
  createNewSavingGoal,
  deleteSavingGoal,
  getAllSavingGoals,
  getAllSavingGoalsById,
  updateSavingGoals,
} from "../controllers/savingGoal.controller.js";
import authMiddleWare from "../middleWare/authMiddleware.js";

const savingGoal_Router = express.Router();

savingGoal_Router.post("/newsaving", authMiddleWare, createNewSavingGoal);
savingGoal_Router.get("/getallsavinggoals", authMiddleWare, getAllSavingGoals);
savingGoal_Router.get("/getbyid/:id", authMiddleWare, getAllSavingGoalsById);
savingGoal_Router.put("/update/:id", authMiddleWare, updateSavingGoals);
savingGoal_Router.get("/getall", authMiddleWare, getAllSavingGoals);
savingGoal_Router.delete("/delete/:id", authMiddleWare, deleteSavingGoal);

export default savingGoal_Router;
