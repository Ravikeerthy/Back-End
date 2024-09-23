import nodemailer from "nodemailer";
import dotenv from "dotenv";
// import User from "../models/user.schema.js";

dotenv.config();

export const registerMail = async (user) => {
  //   const user = await User.findOne({ userName });
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
      subject: "Registration Successful",
      text: `Hello ${user.firstName},\n\nYou have successfully registered with our service.\n\nBest regards,\nThe Team`,
    };

    await transporter.sendMail(details);
    console.log("Registeration email sent successfully");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending registration email:", error });
  }
};
