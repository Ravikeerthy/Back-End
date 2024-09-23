import mongoose from "mongoose";

const userExpense = mongoose.Schema({
  expenseAmount: { type: Number, required: true },
  expenseCategory: { type: String, required: true },
  expenseDescription: String,
  date: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isRecurring: { type: Boolean, default: false },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: function () {
      return this.isRecurring;
    },
  },
});

const ExpenseDetails = mongoose.model("expenseDetails", userExpense);

export default ExpenseDetails;
