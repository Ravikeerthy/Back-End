import mongoose from "mongoose";

const budgetDetails = mongoose.Schema({
    budgetAmount:{type:Number, required:true},
    budgetCategory: {type:String, required:true},
    budgetPeriod:{type:String, required:true},
    startDate:{type:Date, default:Date.now},
    endDate:{type:Date},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },
    isRecurring:{type:Boolean, default:false},
}, {timestamps:true});

const Budget = mongoose.model("budgetSetting", budgetDetails);

export default Budget;
