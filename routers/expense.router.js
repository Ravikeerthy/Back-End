import express from "express";
import { createExpense, deleteExpense, getAllExpense, getExpenseById, getExpenseByUserId, updateExpense } from "../controllers/expense.controller.js";
import authMiddleWare from "../middleWare/authMiddleware.js";

const expenseRouter = express.Router();

expenseRouter.post('/newexpense', authMiddleWare,createExpense);
expenseRouter.get('/getexpense', authMiddleWare,getAllExpense);
expenseRouter.get('/expenseuserId/:userId', authMiddleWare, getExpenseByUserId);
expenseRouter.get('/expenseId/:id', authMiddleWare ,getExpenseById);
expenseRouter.put('/update/:id', authMiddleWare ,updateExpense);
expenseRouter.delete('/delete/:id', authMiddleWare, deleteExpense);


export default expenseRouter;