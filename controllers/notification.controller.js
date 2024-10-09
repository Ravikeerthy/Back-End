import { notifyClientsAboutTransaction } from "../realtime/realtimeSocket.js";
import {
  createNewNotification,
  deleteNotification,
  getNotificationByUserId,
  markNotificationAsRead,
} from "../utils/notificationMail.js";

export const createNotification = async (req, res) => {
  const { userId, message } = req.body;
  try {
    const newNotification = await createNewNotification(userId, message);

    notifyClientsAboutTransaction(newNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const notificationByUserId = async (req, res) => {
  try {
    await getNotificationByUserId(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const updatedNotification = await markNotificationAsRead(req, res);

    notifyClientsAboutTransaction(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const notificationDelete = async (req, res) => {
  try {
    const deletedNotification = await deleteNotification(req, res);
    notifyClientsAboutTransaction({
      message: "Notification has been deleted",
      id: req.params.id,
    });

    res.status(200).json({ message: "Notification deleted successfully", notification: deletedNotification });

  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};
