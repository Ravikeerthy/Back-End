import ExpenseDetails from "../models/expense.schema.js";
import { check_CreateRecurringTransaction } from "../services/recurringTransactions.js";
import { createNewNotification } from "../utils/notificationMail.js";
import User from "../models/user.schema.js";
import {
  deleteNotification,
  expenseNotification,
  updateNotification,
} from "../utils/registerMail.js";

export const createExpense = async (req, res) => {
  try {
    const {
      expenseAmount,
      expenseCategory,
      expenseDescription,
      date,
      isRecurring,
      frequency,
    } = req.body;
    console.log("Expense Payloads: ", req.body);

    const userId = req.user._id;
    console.log("expense UserId: ", userId);

    const expenseDate = new Date(date);
    const month = expenseDate.getMonth() + 1;

    const newExpense = new ExpenseDetails({
      expenseAmount,
      expenseCategory,
      expenseDescription,
      date: expenseDate,
      month,
      isRecurring,
      frequency,
      userId,
    });

    console.log(newExpense);
    await newExpense.save();

    const user = await User.findById(userId);

    if (isRecurring) {
      await check_CreateRecurringTransaction(newExpense);
      await expenseNotification(userId, newExpense, "created");
    } else {
      await expenseNotification(userId, newExpense, "added");
    }

    res.status(200).json({
      message: "Expense details is created successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllExpense = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const getallexpense = await ExpenseDetails.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalItems = await IncomeDetails.countDocuments();

    res.status(200).json({
      data: getallexpense,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExpenseByUserId = async (req, res) => {
  const { userId } = req.params;
  console.log("UserID", userId);
  // const month = req.query.month;
  // const week = req.query.week;
  try {
    // let startDate, endDate;

    // if (month === "previous") {
    //   startDate = moment().subtract(1, "months").startOf("month").toDate();
    //   endDate = moment().subtract(1, "months").endOf("month").toDate();
    // } else if (month === "current") {
    //   startDate = moment().startOf("month").toDate();
    //   endDate = moment().endOf("month").toDate();
    // }

    // if (week === "previous") {
    //   startDate = moment().subtract(1, "weeks").startOf("week").toDate();
    //   endDate = moment().subtract(1, "weeks").endOf("week").toDate();
    // } else if (week === "current") {
    //   startDate = moment().startOf("week").toDate();
    //   endDate = moment().endOf("week").toDate();
    // }

    // if (!startDate || !endDate) {
    //   return res.status(400).json({ message: "Invalid period specified" });
    // }

    const userExpenses = await ExpenseDetails.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // const totalExpenses = userExpenses.reduce(
    //   (total, expense) => total + expense.expenseAmount,
    //   0
    // );

    console.log("Find User Expenses: ", userExpenses);

    if (!userExpenses || userExpenses.length === 0) {
      return res.status(400).json({ message: "User Expenses not found" });
    }

    res.status(200).json({
      message: "User Expenses retrieved successfully",
      userExpenses,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Id", id);

    const expensedId = await ExpenseDetails.findById(id);
    console.log("ExpensedId", expensedId);

    if (!expensedId) {
      return res.status(400).json({ message: "Expense details not found" });
    }

    res.status(200).json({ message: expensedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      expenseAmount,
      expenseCategory,
      expenseDescription,
      date,
      isRecurring,
      frequency,
      userId,
    } = req.body;

    const updatedExpense = await ExpenseDetails.findByIdAndUpdate(
      id,
      {
        $set: {
          expenseAmount,
          expenseCategory,
          expenseDescription,
          date,
          isRecurring,
          frequency,
        },
      },
      { new: true, runValidators: true }
    );
    console.log(updatedExpense);

    if (!updatedExpense) {
      return res.status(400).json({ message: "Expense details not found" });
    }

    if (isRecurring) {
      await check_CreateRecurringTransaction(updatedExpense);
      await createNewNotification(
        updatedExpense.userId,
        `A recurring expense of ${expenseAmount} has been created.`
      );
    } else {
      await createNewNotification(
        updatedExpense.userId,
        `An expense of ${expenseAmount} has been added.`
      );
    }
    const user = await User.findById(updatedExpense.userId);
    await updateNotification(user, updatedExpense, "Expense");
    res
      .status(200)
      .json({ message: "Expense details id updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expenseDetails = await ExpenseDetails.findById(id);
    if (!expenseDetails) {
      return res.status(400).json({ message: "Expense Details is not found" });
    }
    const deletedExpense = await ExpenseDetails.deleteOne({ _id: id });
    if (deletedExpense.deletedCount == 0) {
      return res
        .status(400)
        .json({ message: "Expense details could not be deleted" });
    }

    const user = await User.findById(expenseDetails.userId);
    await deleteNotification(user, expenseDetails, "Expense");
    res
      .status(200)
      .json({ message: "Expense details is successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
