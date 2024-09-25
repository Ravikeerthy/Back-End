import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) =>{
  return jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
}
export default generateToken;
