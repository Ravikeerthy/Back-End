import mongoose from "mongoose";

const savingGoalSchema = new mongoose.Schema(
  {
    savingAmount: { type: Number, required: true },
    targetDate: { type: Date, required: true },
    source: { type: String, requried: true },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
      },
    ],
  },
  { timestamps: true }
);

const savingGoal = mongoose.model("savingGoal", savingGoalSchema);

export default savingGoal;
