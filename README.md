# 🛠️ Expense Tracker - Backend

This is the backend for the Expense Tracker project, built with Node.js and Express. It provides RESTful API endpoints for managing expenses, income, budgets, and user authentication.

## 🚀 Features
- **User Authentication**: Secure login with JWT (JSON Web Token) authentication.
- **Expense Management**: Manage expenses, income, and budgets efficiently.
- **Real-time Updates**: Utilizes Socket.io for real-time communication and updates.
- **Middleware**: To ensure secure authentication and role-based authorization of users.

## 🧰 Tech Stack
- **Node.js**: The JavaScript runtime used for building the server-side logic.
- **Express.js**: A fast, unopinionated web framework for Node.js.
- **MongoDB**: NoSQL database for storing expense and user data.
- **JWT**: JSON Web Tokens used for secure authentication.
- **Socket.io**: A library for real-time web applications, enabling bidirectional communication between the server and clients over WebSockets.
- **Nodemon**: A development tool that automatically restarts the server when file changes are detected, improving the development workflow.
- **Render**: Hosting platform for deploying the backend server.

## 📂 Environment Variables
The following environment variables should be set in your .env file:

PORT=4000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret Key>

## 📦 Dependencies
- **bcryptjs**: Password hashing.
- **body-parser**: Middleware for parsing request bodies.
- **cookie-parser**: Middleware for parsing cookies.
- **cors**: Enable Cross-Origin Resource Sharing.
- **dotenv**: Load environment variables.
- **exceljs**: For Excel file manipulations.
- **express**: Web framework for routing and middleware.
- **joi**: Schema validation.
- **jsonwebtoken**: For JWT handling.
- **mongoose**: MongoDB object modeling.
- **node-cron**: For scheduling tasks.
- **nodemailer**: Email sending functionality.
- **nodemon**: Development tool for auto-restarting the server.
- **socket.io**: Real-time communication library.

  ## About
Server for Expense Tracker dashboard built using Node.js, Express.js, JWT for authentication, and MongoDB for the database.

## Topics
jwt, mongodb, mongoose, expressjs, bcrypt

  
