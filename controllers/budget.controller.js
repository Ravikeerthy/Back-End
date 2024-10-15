import Budget from "../models/budget.schema.js";
import {
  budgetNotification,
  deleteNotification,
  updateNotification,
} from "../utils/registerMail.js";
import User from "../models/user.schema.js";



export const createNewBudget = async (req, res) => {
 
  try {
    const { budgetAmount, budgetCategory, budgetPeriod } = req.body;
    console.log("CreateBudget", req.body);

    const userId = req.user?._id;
    console.log("budget UserId: ", userId);

    const newBudget = new Budget({
      budgetAmount,
      budgetCategory,
      budgetPeriod,
      userId,
    });

    await newBudget.save();

    console.log("newBudget", newBudget);

    
    await budgetNotification(userId, newBudget, "created");

    res
      .status(200)
      .json({ message: "New Budget is created successfully", newBudget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllBudget = async (req, res) => {
  try {
    const allBudget = await Budget.find();
    if (!allBudget || allBudget.length == 0) {
      return res.status(400).json({ message: "No budgets Found" });
    }
    res
      .status(200)
      .json({ message: "Budgets retrieved successfully", allBudget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getBudgetById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("id", userId);

    const BudgetById = await Budget.find({ userId });
    console.log("BudgetById", BudgetById);

    if (!BudgetById) {
      return res.status(400).json({ message: "Budget is not found" });
    }
    res.status(200).json({ message: BudgetById });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getBudgetByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userBudget = await Budget.find({ userId });
    console.log("Get UserBydget: ", userBudget);

    if (!userBudget || userBudget.length === 0) {
      return res.status(400).json({ message: "User budgets not found" });
    }
    res
      .status(200)
      .json({ message: "User budgets retrieved successfully", userBudget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { budgetAmount, budgetCategory, budgetPeriod } = req.body;

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { $set: { budgetAmount, budgetCategory, budgetPeriod } },
      { new: true, runValidators: true }
    );
    console.log(updatedBudget);

    if (!updatedBudget) {
      return res.status(400).json({ message: "Budget details is not found" });
    }

    res.status(200).json({
      message: "Budget details is updated successfully",
      updatedBudget,
    });

    const user = await User.findById(updatedBudget.userId);
    await updateNotification(user, updatedBudget, "Budget");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBudget = await Budget.deleteOne({ _id: id });
    console.log(deletedBudget);
    if (!deletedBudget || deletedBudget.length === 0) {
      return res.status(400).json({ message: "Budget details not found" });
    }
    const user = await User.findById(deletedBudget.userId);
    await deleteNotification(user, deletedBudget, "Budget");
    res.status(200).json({ message: "Budget details is deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
