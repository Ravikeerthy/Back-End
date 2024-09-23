import { createNewNotification, deleteNotification, getNotificationByUserId, markNotificationAsRead } from "../utils/notificationMail.js";

export const createNotification = async(req, res) =>{
    const {userId, message} = req. body;
    try {
        await createNewNotification(userId, message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const notificationByUserId = async(req, res) =>{
    try {
        await getNotificationByUserId(req,res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async(req, res) =>{
    try {
        await markNotificationAsRead(req, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const notificationDelete = async(req, res) =>{
    try {
        await deleteNotification(req, res)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

