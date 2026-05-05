import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  dietaryPreferences: {
    vegan: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    keto: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
  },
  dailyCaloriesGoal: { type: Number, default: 2000 }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
