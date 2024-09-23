import express from "express";
import { createNewBudget, deleteBudget, getAllBudget, getBudgetById, getBudgetByUserId, updateBudget } from "../controllers/budget.controller.js";
import authMiddleWare from "../middleWare/authMiddleware.js";

const budgetRouter = express.Router();

budgetRouter.post('/newbudget',authMiddleWare ,createNewBudget);
budgetRouter.get('/getbudget',authMiddleWare ,getAllBudget);
budgetRouter.get('/getBudgetById/:id', authMiddleWare, getBudgetById);
budgetRouter.get('/getBudgetByUserId/:userId', authMiddleWare, getBudgetByUserId);
budgetRouter.put('/update/:id',authMiddleWare ,updateBudget);
budgetRouter.delete('/delete/:id', authMiddleWare , deleteBudget);

export default budgetRouter;