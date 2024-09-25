import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./database/db_congif.js";
import newUser from "./routers/user.router.js";
import savingGoal_Router from "./routers/savingGoal.router.js";
import incomeRouter from "./routers/income.router.js";
import expenseRouter from "./routers/expense.router.js";
import budgetRouter from "./routers/budget.router.js";
import notificationRouter from "./routers/notification.router.js";
import "./jobs/cornjobs.js";

const app = express();
app.use(bodyParser.json());

app.use(express.json());

const corsOptions = {
  origin: ['http://example.com', 'http://another-domain.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};
app.use(cors(corsOptions));
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to our Expense Tracker</h1>`);
});

app.use("/user/newuser", newUser);
app.use("/savings", savingGoal_Router);
app.use("/income", incomeRouter);
app.use("/expense", expenseRouter);
app.use("/budget", budgetRouter);
app.use('/notification', notificationRouter);

dbConnect();

app.listen(port, () => {
  console.log(`App is listening in ${port}`);
});
