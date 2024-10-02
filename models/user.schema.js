import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: String },
  tokens: [{
    token:{type:String, required:true}
  }],
  
}, { timestamps: true });

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
})

const User = mongoose.model("User", userSchema);

export default User;
