import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.schema.js";
dotenv.config();

const authMiddleWare = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  try {
   const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({_id:decoded._id, "tokens.token":token});
      if (!user) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.token = token;      
      req.user = user;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Authentication Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default authMiddleWare;
