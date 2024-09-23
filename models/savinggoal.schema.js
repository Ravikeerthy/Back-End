import mongoose from "mongoose";

const savingGoalSchema = new mongoose.Schema(
  {
    savingAmount: { type: Number, required: true },
    targetDate: { type: Date, required: true },
    currentAmount: { type: Number, requried: true },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const savingGoal = mongoose.model("savingGoal", savingGoalSchema);

export default savingGoal;