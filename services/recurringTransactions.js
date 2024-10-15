import IncomeDetails from "../models/income.schema.js";
import ExpenseDetails from "../models/expense.schema.js";
import moment from "moment";

const months = moment.months();

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

const check_CreateRecurringTransaction = async (userId) => {
  try {
    const currentDate = new Date();

    const recurringIncome = await IncomeDetails.find({ userId, isRecurring: true });
    const recurringExpense = await ExpenseDetails.find({ userId, isRecurring: true });

    const processTransaction = async (item, Model) => {
      const nextDate = calculateNextDate(item.date, item.frequency);

      if (nextDate <= currentDate) {
        const existingItem = await Model.findOne({
          userId,
          date: nextDate,
          amount: item.amount,
        });

        if (!existingItem) {
          const newItem = { ...item._doc, date: nextDate, month: months[nextDate.getMonth()] };
          delete newItem._id;
          await Model.create(newItem);
        }
      }
    };

    const incomePromises = recurringIncome.map((income) => processTransaction(income, IncomeDetails));
    const expensePromises = recurringExpense.map((expense) => processTransaction(expense, ExpenseDetails));

    await Promise.all([...incomePromises, ...expensePromises]);
    console.log("Recurring transactions checked and created successfully.");
  } catch (error) {
    console.error(`Error in checking or creating recurring transactions for user ${userId}:`, error);
  }
};


export { check_CreateRecurringTransaction, calculateNextDate };
