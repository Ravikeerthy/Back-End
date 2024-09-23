import express from "express";
import { createNewUser, deleteUser, getUser, newPassword, reset_password, updateUser, userLogin, userLogout, userPage } from "../controllers/user.controller.js";
import authMiddleWare from "../middleWare/authMiddleware.js";


const newUser = express.Router();

newUser.post('/register', createNewUser);
newUser.post('/login', userLogin);
newUser.get('/getuser/:id',authMiddleWare, getUser);
newUser.put('/update/:id',authMiddleWare, updateUser);
newUser.delete('/delete/:id',authMiddleWare, deleteUser);
newUser.get('/loggedIn', authMiddleWare ,userPage);
newUser.post('/resetpassword', reset_password);
newUser.post('/newPassword/:token', newPassword);
newUser.post('/logout', authMiddleWare ,userLogout);


export default newUser;