import express from "express";
import { createIncomeDetails, deleteIncomeDetails, getAllIncome, getIncomeById, getIncomeByUserId, updateUserIncome } from "../controllers/income.controller.js";
import authMiddleWare from "../middleWare/authMiddleware.js";

const incomeRouter = express.Router();

incomeRouter.post('/newincome', createIncomeDetails);
incomeRouter.get('/getallincome', authMiddleWare, getAllIncome);
incomeRouter.get('/getincomebyid/:id',authMiddleWare, getIncomeById);
incomeRouter.get('/getIncomeByUserId/:userId', authMiddleWare, getIncomeByUserId);
incomeRouter.put('/update/:id',authMiddleWare, updateUserIncome);
incomeRouter.delete('/delete/:id', authMiddleWare,deleteIncomeDetails)

export default incomeRouter;
