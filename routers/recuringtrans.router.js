import express from "express";
import { checkingAndCreateRecurringTransaction } from "../controllers/checkrecurringtrans.controller.js";
import authMiddleWare from "../middleWare/authMiddleware.js";

const recurTrans = express.Router();

recurTrans.post('/recurringtrans',authMiddleWare, checkingAndCreateRecurringTransaction)

export default recurTrans;