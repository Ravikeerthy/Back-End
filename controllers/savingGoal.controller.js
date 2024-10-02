import savingGoal from "../models/savinggoal.schema.js";


export const createNewSavingGoal = async (req, res) => {
  try {
    const { savingAmount, targetDate, source, userId } = req.body;

    console.log("req Body",req.body);
    
     const newSaving = new savingGoal({
      savingAmount,
      targetDate: new Date(targetDate).toISOString(),
      source,
      userId,
    });
    console.log("New Saving", newSaving);

    await newSaving.save();

    res.status(200).json({
      message: "Saving Goal is created successfully",
      Saving_Goal: newSaving,
    });
  } catch (error) {
    console.log("Error:", error);

    res.status(500).json({ message: "Error in creating savingGoal", error });
  }
};

export const getAllSavingGoals = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const userId = req.user._id;

    const savingGoals = await savingGoal
      .find({ userId })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalItems = await savingGoal.countDocuments({ userId });

    res.status(200).json({
      data: savingGoals,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saving goals" });
  }
};

export const getAllSavingGoalsById = async (req, res) => {
  try {
    const savingGoalId = req.params.id;
    const savingGoals = await savingGoal.findOne({ userId });
    console.log(savingGoalId);

    if (!savingGoalId) {
      return res.status(400).json({ message: "Saving Goal is not found" });
    }
    res
      .status(200)
      .json({ message: "Saving goal retrieved successfully", savingGoals });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saving goals" });
  }
};

export const getAllSavingGoal = async (req, res) => {
  try {
    const savingGoals = req.params.id;

    const result = await savingGoal.findById(savingGoals);

    if (!result) {
      return res.status(400).json({ message: "Saving Goal is not found" });
    }

    res.status(200).json({ message: "Saving Goal retrieved successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateSavingGoals = async (req, res) => {
  try {
    const { savingAmount, currentAmount } = req.body;

    const savingGoalId = req.params.id;

    const updatedSavingGoal = await savingGoal.findByIdAndUpdate(
      savingGoalId,
      { $set: { savingAmount, currentAmount } },
      { new: true }
    );

    if (!updatedSavingGoal) {
      return res.status(400).json({ message: "Saving goal not found" });
    }

    res.status(200).json({
      message: "Saving Goal is updated successfully",
      updatedSavingGoal,
    });
  } catch (error) {
    res.status(500).json({ message: "Sever Error" });
  }
};

export const deleteSavingGoal = async (req, res) => {
  try {
    const deleteId = req.params.id;
    const deletedSavingGoal = await savingGoal.findByIdAndDelete(
      deleteId,
    );

    if (!deletedSavingGoal) {
      return res.status(400).json({ message: "Saving goal is not found" });
    }

    res.status(200).json({ message: "Saving Goal is Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
