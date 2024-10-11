import IncomeDetails from "../models/income.schema.js";
import { notifyClientsAboutTransaction } from "../realtime/realtimeSocket.js";
import { check_CreateRecurringTransaction } from "../services/recurringTransactions.js";
import { createNewNotification } from "../utils/notificationMail.js";

export const createIncomeDetails = async (req, res) => {
  try {
    const { incomeAmount, incomeSource, date, isRecurring, frequency } =
      req.body;
    console.log("req.body", req.body);

    const userId = req.user._id;
    console.log("Income UserID", userId);

    const incomeDate = new Date(date);
    const month = incomeDate.getMonth()+1;
    

    const newIncomeAmt = new IncomeDetails({
      incomeAmount,
      incomeSource,
      date,
      month,
      isRecurring,
      frequency,
      userId,
    });
    const savedIncome = await newIncomeAmt.save();
    console.log("New Income Amount", newIncomeAmt);

    notifyClientsAboutTransaction(savedIncome, userId);

    const notificationMessage = isRecurring
      ? "Recurring income has been added successfully."
      : "Income details successfully created.";

    await createNewNotification(userId, notificationMessage);

    res.status(200).json({ message: "Income Details Successfully created." });
  } catch (error) {
    console.log("Error creating income:", error);

    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllIncome = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const userId = req.user._id;
    await check_CreateRecurringTransaction(userId);
    const totalItems = await IncomeDetails.countDocuments({ userId });
    const allIncomeDetails = await IncomeDetails.find({ userId })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      data: allIncomeDetails,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getIncomeById = async (req, res) => {
  try {
    const { id: incomeId } = req.params;
    const userIncomeDetails = await IncomeDetails.findById(incomeId);

    if (!userIncomeDetails) {
      return res.status(400).json({ message: "Income Details id not found" });
    }

    res.status(200).json({ message: userIncomeDetails });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getIncomeByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    const userIncome = await IncomeDetails.find({ userId });

    if (!userIncome || userIncome.length == 0) {
      return res.status(400).json({ message: "User Id is not found" });
    }

    res.status(200).json({ message: "User Income retrieved successfully" ,userIncome });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUserIncome = async (req, res) => {
  try {
    const { incomeAmount, incomeSource, date, month, isRecurring, frequency } =
      req.body;
    const { id } = req.params;

    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const updatedIncome = await IncomeDetails.findByIdAndUpdate(
      id,
      {
        $set: {
          incomeAmount,
          incomeSource,
          date,
          month,
          isRecurring,
          frequency,
        },
      },
      { new: true, runValidators: true }
    );

    console.log("updated:", updatedIncome);

    if (!updatedIncome) {
      console.error("Failed to update income:", id);

      return res.status(400).json({ message: "Income details not found" });
    }

    notifyClientsAboutTransaction(updatedIncome);

    if (isRecurring) {
      await check_CreateRecurringTransaction(updatedIncome);
      await createNewNotification(
        updatedIncome.userId,
        "Recurring income has been updated successfully."
      );
    } else {
      await createNewNotification(
        updatedIncome.userId,
        "Income details updated successfully."
      );
    }
    res.status(200).json({
      message: "Updated income details successfully",
      updatedIncome: updatedIncome,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteIncomeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const incomeDetails = await IncomeDetails.findById(id);

    if (!incomeDetails) {
      return res.status(400).json({ message: "Income Details Not Found" });
    }

    const deletedIncome = await IncomeDetails.deleteOne({ _id: id });
    if (deletedIncome.deletedCount === 0) {
      return res
        .status(400)
        .json({ message: "Income details could not be deleted" });
    }

    notifyClientsAboutTransaction({
      message: "Income details have been deleted successfully.",
      id,
    });

    await createNewNotification(
      incomeDetails.userId,
      "Income details have been deleted successfully."
    );
    res
      .status(200)
      .json({ message: "Income details deleted successfully", deletedIncome });
  } catch (error) {
    console.error("Error deleting income details:", error); 
    res.status(500).json({ message: "Server Error" });
  }
};

export const aggregateMonthlyIncome = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate income data by month
    const monthlyIncome = await IncomeDetails.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalIncome: { $sum: "$incomeAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthlyData = Array(12).fill(0);

    monthlyIncome.forEach((item) => {
      monthlyData[item._id - 1] = item.totalIncome;
    });

    res.status(200).json({ monthlyIncome: monthlyData });
  } catch (error) {
    console.error("Error aggregating monthly income:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
