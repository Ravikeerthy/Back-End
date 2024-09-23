// services/triggerRecurringTransactions.js

import IncomeDetails from "../models/income.schema.js";
import ExpenseDetails from "../models/expense.schema.js";
import { calculateNextDate } from "./recurringTransactions.js";

const triggerRecurringTransactions = async () => {
  try {
    const currentDate = new Date();
    
    // Find all recurring incomes and expenses
    const recurringIncomes = await IncomeDetails.find({ isRecurring: true });
    const recurringExpenses = await ExpenseDetails.find({ isRecurring: true });
    
    // Process recurring incomes
    for (const income of recurringIncomes) {
      const nextDate = calculateNextDate(income.date, income.frequency);
      if (nextDate <= currentDate) {
        await IncomeDetails.create({
          ...income._doc,
          date: nextDate,
        });
      }
    }

    // Process recurring expenses
    for (const expense of recurringExpenses) {
      const nextDate = calculateNextDate(expense.date, expense.frequency);
      if (nextDate <= currentDate) {
        await ExpenseDetails.create({
          ...expense._doc,
          date: nextDate,
        });
      }
    }

    console.log("Recurring transactions processed successfully.");
  } catch (error) {
    console.error("Error processing recurring transactions:", error);
  }
};

export default triggerRecurringTransactions;
