import express from "express";
import authMiddleWare from "../middleWare/authMiddleware.js";
import { createNotification, markAsRead, notificationByUserId, notificationDelete } from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.post('/create_notification', authMiddleWare, createNotification);
notificationRouter.get('/userId/:id', authMiddleWare, notificationByUserId);
notificationRouter.patch('/markasread/:id', authMiddleWare, markAsRead);
notificationRouter.delete('/delete/:id', authMiddleWare, notificationDelete);

export default notificationRouter;