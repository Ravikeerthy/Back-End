import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.schema.js";

dotenv.config();

export const notificationMail = async (userEmail, subject, text) => {
  // const user = await User.findOne({ userName });
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let details = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      text,
    };

    await transporter.sendMail(details);
    console.log("Registeration email sent successfully");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending registration email:", error });
  }
};

export const registerMail = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subject = "Registration Successful";
    const text = `Hello ${user.firstName},\n\nYou have successfully registered with our service.\n\nBest regards,\nThe Team`;
    await notificationMail(user.userName, subject, text);
  } catch (error) {
    console.error("Error sending registration mail:", error);
  }
};

export const incomeNotification = async (userId, incomeDetails, action) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subject = `Income ${action} Notification`;
    const text = `Hello ${user.firstName},\n\nYour income of ${incomeDetails.incomeAmount} from ${incomeDetails.incomeSource} has been ${action} successfully.\n\nBest regards,\nThe Team`;
    await notificationMail(user.userName, subject, text);
  } catch (error) {
    console.error("Error sending income mail:", error);
  }
};

export const expenseNotification = async (userId, expenseDetails, action) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subject = `Expense ${action} Notification`;
    const text = `Hello ${user.firstName},\n\nYour expense of ${expenseDetails.expenseAmount} for ${expenseDetails.expenseCategory} has been ${action} successfully.\n\nBest regards,\nThe Team`;
    await notificationMail(user.userName, subject, text);
  } catch (error) {
    console.error("Error sending expense mail:", error);
  }
};

export const budgetNotification = async (userId, budgetDetails, action) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subject = `Budget ${action} Notification`;
    const text = `Hello ${user.firstName},\n\nYour budget of ${budgetDetails.budgetAmount} for ${budgetDetails.budgetCategory} has been ${action} successfully.\n\nBest regards,\nThe Team`;
    await notificationMail(user.userName, subject, text);
  } catch (error) {
    console.error("Error sending budget mail:", error);
  }
};

export const savingNotification = async (userId, savingDetails, action) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subject = `Saving ${action} Notification`;
    const text = `Hello ${user.firstName},\n\nYour saving of ${savingDetails.savingAmount} for ${savingDetails.source} has been ${action} successfully.\n\nBest regards,\nThe Team`;
    await notificationMail(user.userName, subject, text);
  } catch (error) {
    console.error("Error sending saving mail:", error);
  }
};

export const updateNotification = async (userId, details, type) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subject = `${type} Update Notification`;
    const text = `Hello ${
      user.firstName
    },\n\nYour ${type.toLowerCase()} record of ${
      details.amount || details.incomeAmount
    } from ${
      details.source || details.incomeSource
    } has been updated successfully.\n\nBest regards,\nThe Team`;

    await notificationMail(user.userName, subject, text);
  } catch (error) {
    console.error("Error sending updation mail:", error);
  }
};

export const deleteNotification = async (userId, details, type) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subject = `${type} Deletion Notification`;
    const text = `Hello ${
      user.firstName
    },\n\nYour ${type.toLowerCase()} record of ${
      details.amount || details.incomeAmount
    } from ${
      details.source || details.incomeSource
    } has been deleted successfully.\n\nBest regards,\nThe Team`;

    await notificationMail(user.userName, subject, text);
  } catch (error) {
    console.error("Error sending deletion  mail:", error);
  }
};
