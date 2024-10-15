// services/triggerRecurringTransactions.js

import IncomeDetails from "../models/income.schema.js";
import ExpenseDetails from "../models/expense.schema.js";
import { calculateNextDate } from "./recurringTransactions.js";

const triggerRecurringTransactions = async () => {
  try {
    const currentDate = new Date();

    const recurringItems = [
      { model: IncomeDetails, type: "income" },
      { model: ExpenseDetails, type: "expense" },
    ];

    for (const { model, type } of recurringItems) {
      const recurringData = await model.find({ isRecurring: true });
      const newItems = [];

      for (const item of recurringData) {
        const nextDate = calculateNextDate(item.date, item.frequency);
        if (nextDate <= currentDate) {
          console.log(`Processing ${type}: ${item._id}, next date: ${nextDate}`);
          newItems.push({ ...item._doc, date: nextDate });
        }
      }

      if (newItems.length > 0) {
        await model.insertMany(newItems);
        console.log(`${newItems.length} ${type} transactions created.`);
      }
    }

    console.log("Recurring transactions processed successfully.");
  } catch (error) {
    console.error("Error processing recurring transactions:", error.message);
  }
};


export default triggerRecurringTransactions;
