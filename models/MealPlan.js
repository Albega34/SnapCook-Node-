import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema({
  userId: { type: String, default: "default_user" },
  day: { type: String, required: true }, // Monday, Tuesday, etc.
  meal: { type: String, required: true }, // Breakfast, Lunch, Dinner
  recipeTitle: { type: String, required: true },
  recipeId: { type: String }
}, { timestamps: true });

export const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
