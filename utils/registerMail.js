import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.schema.js";

dotenv.config();

export const notificationMail = async (user, subject, text) => {
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
      to: user.userName,
      subject,
      text,
      // to: user.userName,
      // subject: "Registration Successful",
      // text: `Hello ${user.firstName},\n\nYou have successfully registered with our service.\n\nBest regards,\nThe Team`,
    };

    await transporter.sendMail(details);
    console.log("Registeration email sent successfully");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending registration email:", error });
  }
};

export const registerMail = async (user) => {
  const subject = "Registration Successful";
  const text = `Hello ${user.firstName},\n\nYou have successfully registered with our service.\n\nBest regards,\nThe Team`;
  await sendEmail(user.userName, subject, text);
};

export const incomeNotification = async (user, incomeDetails, action) => {
  const subject = `Income ${action} Notification`;
  const text = `Hello ${user.firstName},\n\nYour income of ${incomeDetails.incomeAmount} from ${incomeDetails.incomeSource} has been ${action} successfully.\n\nBest regards,\nThe Team`;
  await sendEmail(user.userName, subject, text);
};

export const expenseNotification = async (user, expenseDetails, action) => {
  const subject = `Expense ${action} Notification`;
  const text = `Hello ${user.firstName},\n\nYour expense of ${expenseDetails.expenseAmount} for ${expenseDetails.expenseSource} has been ${action} successfully.\n\nBest regards,\nThe Team`;
  await sendEmail(user.userName, subject, text);
};

export const budgetNotification = async (user, budgetDetails, action) => {
  const subject = `Budget ${action} Notification`;
  const text = `Hello ${user.firstName},\n\nYour budget of ${budgetDetails.amount} for ${budgetDetails.category} has been ${action} successfully.\n\nBest regards,\nThe Team`;
  await sendEmail(user.userName, subject, text);
};

export const savingNotification = async (user, savingDetails, action) => {
  const subject = `Saving ${action} Notification`;
  const text = `Hello ${user.firstName},\n\nYour saving of ${savingDetails.savingAmount} for ${savingDetails.category} has been ${action} successfully.\n\nBest regards,\nThe Team`;
  await sendEmail(user.userName, subject, text);
};

export const updateNotification = async (user, details, type) => {
  const subject = `${type} Update Notification`;
  const text = `Hello ${user.firstName},\n\nYour ${type.toLowerCase()} record of ${details.amount || details.incomeAmount} from ${details.source || details.incomeSource} has been updated successfully.\n\nBest regards,\nThe Team`;

  await sendEmail(user.userName, subject, text);
};


export const deleteNotification = async (user, details, type) => {
  const subject = `${type} Deletion Notification`;
  const text = `Hello ${user.firstName},\n\nYour ${type.toLowerCase()} record of ${details.amount || details.incomeAmount} from ${details.source || details.incomeSource} has been deleted successfully.\n\nBest regards,\nThe Team`;

  await sendEmail(user.userName, subject, text);
};
