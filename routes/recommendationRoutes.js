import express from "express";
import axios from "axios";
import { Recipe } from "../models/Recipe.js";
import { fetchPixabayImage } from "../utils/pixabay.js";

const router = express.Router();
let recommendationCache = {}; // Simple in-memory cache

router.post("/", async (req, res) => {
  const { dietaryPreferences } = req.body;
  
  // 1. Generate a unique key for the current diet preferences
  const dietStr = Object.entries(dietaryPreferences || {})
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .sort()
    .join(", ") || "None";

  // 2. Check Cache (valid for 30 minutes)
  const cached = recommendationCache[dietStr];
  if (cached && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {
    console.log(`=== Cache Hit for recommendations: [${dietStr}] ===`);
    return res.json(cached.data);
  }

  let dishes = ["Avocado Toast", "Quinoa Salad", "Smoothie Bowl"]; // Default Fallback names

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyAEr5UTEfnHfpkYTPurq9SDgb0CkRCZAKY";

    const prompt = `
      Recommend exactly 3 delicious and popular food dish names for a user with these dietary preferences: [${dietStr}].
      Keep the names simple and recognizable (e.g., 'Avocado Toast', 'Quinoa Salad').
      Return ONLY a JSON array of strings.
    `;

    console.log(`=== Fetching AI Recommendations for: [${dietStr}] ===`);
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 5000 } // Add timeout
    );

    try {
      const text = geminiRes.data.candidates[0].content.parts[0].text;
      const cleanText = text.replace(/```json|```/g, "").trim();
      const aiDishes = JSON.parse(cleanText);
      if (Array.isArray(aiDishes) && aiDishes.length >= 3) {
        dishes = aiDishes.slice(0, 3);
      }
      console.log("=== Gemini Suggested Dishes: ===", dishes);
    } catch (e) {
      console.warn("=== Gemini Parse Error (Using Fallbacks): ===", e.message);
    }
  } catch (error) {
    if (error.response?.status === 429) {
      console.error("=== Gemini Rate Limit (429) Hit! Using default recommendations. ===");
    } else {
      console.error("=== Gemini API Error (Using Fallbacks): ===", error.message);
    }
    // Continue with default 'dishes'
  }

  // 3. Map these dishes to a recommendation object and fetch Pixabay images
  try {
    const recommendations = await Promise.all(dishes.map(async (title) => {
      const image = await fetchPixabayImage(title);
      return {
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description: `A delicious ${title} tailored to your ${dietStr} lifestyle.`,
        image,
        tags: dietStr === "None" ? ["Healthy"] : dietStr.split(", ")
      };
    }));

    // Save to cache
    recommendationCache[dietStr] = {
      timestamp: Date.now(),
      data: recommendations
    };

    console.log(`=== Final Recommendations Generated & Cached for [${dietStr}] ===`);
    res.json(recommendations);
  } catch (error) {
    console.error("=== Final Recommendation Mapping Error: ===", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
