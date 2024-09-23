import ExpenseDetails from "../models/expense.schema.js";
import { checkAndCreateRecurringTranscation } from "../services/recurringTransactions.js";
import { createNewNotification } from "../utils/notificationMail.js";

export const createExpense = async (req, res) => {
  try {
    const {
      expenseAmount,
      expenseCategory,
      expenseDescription,
      date,
      userId,
      isRecurring,
      frequency,
    } = req.body;

    const newExpense = new ExpenseDetails({
      expenseAmount,
      expenseCategory,
      expenseDescription,
      date,
      userId,
      isRecurring,
      frequency,
    });

    console.log(newExpense);
    await newExpense.save();

    if (isRecurring) {
      await checkAndCreateRecurringTranscation(newExpense);
      await createNewNotification(
        userId,
        `A recurring expense of ${expenseAmount} has been created.`
      );
    } else {
      await createNewNotification(
        userId,
        `An expense of ${expenseAmount} has been added.`
      );
    }

    res
      .status(200)
      .json({ message: "Expense details is created successfully" });
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
  try {
    const { userId } = req.params;
    console.log("UserID", userId);

    const expenseByUserId = await ExpenseDetails.find({ userId });

    console.log(expenseByUserId);

    if (!expenseByUserId || expenseByUserId.length === 0) {
      return res.status(400).json({ message: "User is not found" });
    }

    res.status(200).json({ message: expenseByUserId });
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
      await checkAndCreateRecurringTranscation(updatedExpense);
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

    await createNewNotification(
      expenseDetails.userId,
      `Your expense has been deleted.`
    );
    res
      .status(200)
      .json({ message: "Expense details is successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
