import mongoose from "mongoose";

const incomeSchema = mongoose.Schema({
  incomeAmount: { type: Number, required: true },
  incomeSource: { type: String, required: true },
  date: { type: Date, default: Date.now },
  month: { type: String, required: true },
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

const IncomeDetails = mongoose.model("IncomeDetails", incomeSchema);

export default IncomeDetails;
