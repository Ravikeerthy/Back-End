import IncomeDetails from "../models/income.schema.js";
import ExpenseDetails from "../models/expense.schema.js";

const calculateNextDate = (lastDate, frequency) => {
  const date = new Date(lastDate);
  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid frequency provided");
  }
  return date;
};

// Function to check and create recurring transactions for a given user
const check_CreateRecurringTransaction = async (userId) => {
  try {
    const currentDate = new Date();

    const recurringIncome = await IncomeDetails.find({
      userId,
      isRecurring: true,
    });
    const recurringExpense = await ExpenseDetails.find({
      userId,
      isRecurring: true,
    });

    const incomePromises = recurringIncome.map(async (income) => {
      const nextDate = calculateNextDate(income.date, income.frequency);

      if (nextDate <= currentDate) {
        const existingIncome = await IncomeDetails.findOne({
          userId,
          date: nextDate,
          amount: income.amount,
        });

        if (!existingIncome) {
          const newIncome = { ...income._doc, date: nextDate };
          delete newIncome._id;
          await IncomeDetails.create(newIncome);
          // Optional: Add a notification here
        }
      }
    });

    const expensePromises = recurringExpense.map(async (expense) => {
      const nextDate = calculateNextDate(expense.date, expense.frequency);

      if (nextDate <= currentDate) {
        const existingExpense = await ExpenseDetails.findOne({
          userId,
          date: nextDate,
          amount: expense.amount,
        });

        if (!existingExpense) {
          const newExpense = { ...expense._doc, date: nextDate };
          delete newExpense._id;
          await ExpenseDetails.create(newExpense);
          // Optional: Add a notification here
        }
      }
    });

    // Execute all promises in parallel
    await Promise.all([...incomePromises, ...expensePromises]);
    
  } catch (error) {
    console.error(`Error in checking or creating recurring transactions for user ${userId}:`, error);
  }
};

export { check_CreateRecurringTransaction, calculateNextDate };
