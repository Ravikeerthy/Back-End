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
    
    const newIncomes = [];
    const newExpenses = [];

    // Process recurring incomes
    for (const income of recurringIncomes) {
      const nextDate = calculateNextDate(income.date, income.frequency);
      if (nextDate <= currentDate) {
        console.log(`Processing income: ${income._id}, next date: ${nextDate}`);

        newIncomes.push({ ...income._doc, date: nextDate });
       
      }
    }
    if (newIncomes.length > 0) {
      await IncomeDetails.insertMany(newIncomes);
    
      console.log(`${newIncomes.length} income transactions created.`);
    }

    // Process recurring expenses
    for (const expense of recurringExpenses) {
      const nextDate = calculateNextDate(expense.date, expense.frequency);
      if (nextDate <= currentDate) {

        console.log(`Processing expense: ${expense._id}, next date: ${nextDate}`);

        newExpenses.push({ ...expense._doc, date: nextDate });

        }
    }
    if (newExpenses.length > 0) {
      await ExpenseDetails.insertMany(newExpenses);
     
      console.log(`${newExpenses.length} expense transactions created.`);
    }

    console.log("Recurring transactions processed successfully.");
  } catch (error) {
    console.error("Error processing recurring transactions:", error.message);
  }
};

export default triggerRecurringTransactions;
