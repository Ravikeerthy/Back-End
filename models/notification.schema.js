import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);
notificationSchema.statics.markAsRead = async function (notificationId) {
  return this.updateOne({ _id: notificationId }, { $set: { read: true } });
};


notificationSchema.statics.getUnreadNotifications = async function (userId) {
  return this.find({ userId, read: false });
};


const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
