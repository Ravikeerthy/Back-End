import mongoose from "mongoose";

const userExpense = mongoose.Schema({
  expenseAmount: { type: Number, required: true },
  expenseCategory: { type: String, required: true },
  expenseDescription: { type: String },
  month: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

const ExpenseDetail = mongoose.model("expenseDetail", userExpense);

export default ExpenseDetail;
