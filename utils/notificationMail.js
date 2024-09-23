
import Notification from "../models/notification.schema.js";

export const createNewNotification = async (req, res) => {
  try {
    const {userId, message} = req.body;
    if (!userId || !message) {
      return res.status(400).json({message:"UserId and message is required"});
    }
    const notification = new Notification({ userId, message });
    const savedNotification = await notification.save();

    res.status(200).json({
      message: "Notification Created Successfully",
      savedNotification,
    });
  } catch (error) {
    console.error("Error creating notification", error);
    res.status(500).json({ message: "Error creating notification" });
  }
};

export const getNotificationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const {page=1, limit=10} = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const notification = await Notification.find({ userId }).sort({
      createdAt: -1,
    }).limit(limitNumber*1).skip((pageNumber-1)*limitNumber);

    const totalNotification = await Notification.countDocuments({userId});

    const unreadNotificaationCount = await Notification.countDocuments({userId, read:false})

    res.status(200).json({ notification, totalNotification, unreadNotificaationCount, totalpages: Math.ceil(totalNotification/limitNumber), currentPage:pageNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notification" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(400).json({ message: "Notification is not found" });
    }
    res
      .status(200)
      .json({ message: "Notification marked as read", updatedNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating notification status" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};
