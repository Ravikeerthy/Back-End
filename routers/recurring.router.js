import express from "express";
import { createRecurring, startCron, stopCron } from "../controllers/corn.controller.js";


const recurringRouter = express.Router();

recurringRouter.get('/triggerRecurring', createRecurring);

recurringRouter.post("/start_cron", startCron);

recurringRouter.post('/stop_cron', stopCron);

export default recurringRouter;