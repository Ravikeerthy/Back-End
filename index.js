import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import dbConnect from "./database/db_congif.js";
import newUser from "./routers/user.router.js";
import savingGoal_Router from "./routers/savingGoal.router.js";
import incomeRouter from "./routers/income.router.js";
import expenseRouter from "./routers/expense.router.js";
import budgetRouter from "./routers/budget.router.js";
import notificationRouter from "./routers/notification.router.js";
import "./jobs/cornjobs.js";
import cookieParser from "cookie-parser";
import generate_router from "./routers/generater.router.js";
import recurringRouter from "./routers/recurring.router.js";
import recurTrans from "./routers/recuringtrans.router.js";
import events from "events";
import http from "http";
import { Server } from "socket.io";


dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  origin: "https://finance-and-expense-tracker.netlify.app", 
    methods: ["GET", "POST"],
    credentials: true,
})

app.use(
  cors({
    origin: "https://finance-and-expense-tracker.netlify.app",

    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());

events.EventEmitter.defaultMaxListeners = 30;

const port = process.env.PORT;

io.on("connection", (socket)=>{
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  
})

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to our Expense Tracker</h1>`);
});

app.use("/user/newuser", newUser);
app.use("/savings", savingGoal_Router);
app.use("/income", incomeRouter);
app.use("/expense", expenseRouter);
app.use("/budget", budgetRouter);
app.use("/notification", notificationRouter);
app.use("/generatereport", generate_router);
app.use("/recurring", recurringRouter);
app.use("/createrecurring", recurTrans);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

dbConnect();

app.listen(port, () => {
  console.log(`App is listening in ${port}`);
});
