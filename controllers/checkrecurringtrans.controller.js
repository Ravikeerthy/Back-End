import { check_CreateRecurringTransaction } from "../services/recurringTransactions.js";

export const checkingAndCreateRecurringTransaction = async (req, res) => {
  const { userId } = req.body;
  try {
    await check_CreateRecurringTransaction(userId);
    res.status(200).json({ message: "Recurring transactions checked and processed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing recurring transactions", error });
  }
};
