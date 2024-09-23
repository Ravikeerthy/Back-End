import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.schema.js";
import crypto from "crypto";
dotenv.config();

export const mailServices = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const user = await User.findById(req.user._id);
    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetURL = `http://${req.headers.host}/reset/${token}`;

    let details = {
      from: process.env.EMAIL_USER,
      to: user.userName,
      subject: "NodeMailer Testing mail",
      text: `You are receiving this email because you (or someone else) has requested a password reset for your account. \n\n Please click on the following link, or paste it into your browser to complete the process: \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`,
    };

    transporter.sendMail(details, (err, info) => {
      if (err) {
        res.status(404).json({ message: "SoomeThing went wrong, Try again!", error: err });
      } else {
        res.status(200).json({ message: "Password reset Email Sent successfully" + info.response });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
};
