import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/profile", async (req, res) => {
  try {
    let user = await User.findOne({ id: "default_user" });
    if (!user) {
      user = await User.create({ id: "default_user", name: "Chef", dietaryPreferences: { vegan: false, vegetarian: false, keto: false, glutenFree: false }, dailyCaloriesGoal: 2000 });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/profile", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: "default_user" },
      { dietaryPreferences: req.body.dietaryPreferences },
      { new: true, upsert: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/save-recipe", async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findOneAndUpdate(
      { id: "default_user" },
      { $addToSet: { savedRecipes: recipeId } },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/unsave-recipe", async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findOneAndUpdate(
      { id: "default_user" },
      { $pull: { savedRecipes: recipeId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
