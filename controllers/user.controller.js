import User from "../models/user.schema.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/tokenGenerate.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { registerMail } from "../utils/registerMail.js";
dotenv.config();

//Creating New User
export const createNewUser = async (req, res) => {
  try {
    const { firstName, lastName, userName, password, contactNumber } = req.body;

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({ message: "UserName is already exists" });
    }

    const hashedpassword = await bcryptjs.hash(password, 10); // hassing password using hash function in Bcryptjs library

    const newUser = new User({
      firstName,
      lastName,
      userName,
      password: hashedpassword,
      contactNumber,
    });

    await newUser.save(); // save the new user in database

    await registerMail(newUser); // Send registration email

    res.status(200).json({ message: "User Registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in creating new user" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = await User.findById(userId);
    res.status(200).json({ message: "User Details", userDetails });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//Updating User
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateDta = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateDta, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ message: "User details Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in Updating" });
  }
};

//deleting User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ message: "User Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in deleting user" });
  }
};

//User Login
export const userLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Password is invalid" });
    }
    const token = generateToken(user);

    user.tokens = user.tokens.concat({ token });

    await user.save();

    res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    res.status(500).json({ message: "Error in Login" });
  }
};

// Welcoming Page
export const userPage = async (req, res) => {
  try {
    res.status(200).json({ message: `Welcome, ${req.user.firstName}!` });
  } catch (error) {
    res.status(500).json({ message: "Internal Error" });
  }
};

// Reset your Password
export const reset_password = async (req, res) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName });
    const eMail = user.userName;

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `http://${req.headers.host}/reset/${token}`;

    let details = {
      from: process.env.EMAIL_USER,
      to: eMail,
      subject: "Password Reset mail",
      text: `You are receiving this email because you (or someone else) has requested a password reset for your account. 
      \n\n Please click on the following link, or paste it into your browser to complete the process: 
      \n\n ${resetURL} \n\n If you did not request this, please ignore this email.`,
    };

    transporter.sendMail(details, (err, info) => {
      if (err) {
        return res
          .status(404)
          .json({ message: "SomeThing went wrong, Try again!", error: err });
      }

      res.status(200).json({
        message: "Password reset Email Sent successfully",
        info: info.response,
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal server Error" });
  }
};

// Updating new password
export const newPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({ message: "Token Expired" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Logout
export const userLogout = async (req, res) => {
  try {
    req.user.token = req.user.tokens.filter((f) => f.token != req.token);
    await req.user.save();
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in logging out", error });
  }
};
