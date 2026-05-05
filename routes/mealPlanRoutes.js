import express from "express";
import { MealPlan } from "../models/MealPlan.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const plans = await MealPlan.find({ userId: "default_user" });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { day, meal, recipeTitle, recipeId } = req.body;
    const plan = await MealPlan.create({ userId: "default_user", day, meal, recipeTitle, recipeId });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
