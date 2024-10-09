import cron from "node-cron";
import User from "../models/user.schema.js";
import { check_CreateRecurringTransaction } from "../services/recurringTransactions.js";
import triggerRecurringTransactions from "../services/triggerRecurringTransactions.js";

let cronJob;

export const createRecurring= async (req, res) => {
  try {
    const users = await User.find();

    for (const user of users) {
      await check_CreateRecurringTransaction(user._id);
    }

    res.status(200).json({ message: "Recurring transactions processed for all users" });
  } catch (error) {
    console.error("Error in manual cron job trigger:", error);
    res.status(500).json({ message: "Error processing recurring transactions" });
  }
};


export const startCron = (req, res) => {
  if (cronJob) {
    return res.status(400).json({ message: "Cron job is already running" });
  }

  cronJob = cron.schedule("0 0 * * *", async () => {
    try {
     await triggerRecurringTransactions();
     
      console.log("Scheduled job for recurring transactions executed for all users");
    } catch (error) {
      console.error("Error in scheduled cron job:", error);
    }
  });

  res.status(200).json({ message: "Cron job started" });
};


export const stopCron=(req, res) => {
  if (!cronJob) {
    return res.status(400).json({ message: "Cron job is not running" });
  }

  cronJob.stop(); 
  cronJob = null; 
  res.status(200).json({ message: "Cron job stopped" });
};

