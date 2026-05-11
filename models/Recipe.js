import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: String,
  checked: { type: Boolean, default: false },
  substitutes: [String]
});

const instructionSchema = new mongoose.Schema({
  step: Number,
  title: String,
  time: String,
  desc: String
});

const historySchema = new mongoose.Schema({
  story: String,
  image: String,
  rank: String
});

const trendSchema = new mongoose.Schema({
  country: String,
  flag: String,
  consumption: Number
});

const recipeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  searchTitle: String, // NEW: Original search term to ensure database lookup works
  description: String,
  image: String,
  confidence: Number,
  cuisine: String,
  calories: Number,
  protein: Number,
  fats: Number,
  carbs: Number,
  time: Number,
  rating: Number,
  reviews: String,
  difficulty: String,
  tags: [String],
  servings: Number,
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  history: historySchema,
  trends: [trendSchema]
}, { timestamps: true });

export const Recipe = mongoose.model("Recipe", recipeSchema);
