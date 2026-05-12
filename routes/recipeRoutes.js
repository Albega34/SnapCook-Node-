import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { Recipe } from "../models/Recipe.js";
import { fetchPixabayImage } from "../utils/pixabay.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all recipes
router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get a single recipe by custom ID
router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ id: req.params.id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Scan an image to classify and generate recipe
router.post("/scan", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    let base64Image = "";
    let mimeType = "image/jpeg";

    if (!req.file && !imageUrl) {
      return res.status(400).json({ message: "Image file or URL required" });
    }

    const imgbbKey = process.env.IMGBB_API_KEY || "031f6c420634cd1572b116f59a52abea";
    const predictionApiUrl = process.env.PREDICTION_API_URL || "https://snapcook-model.onrender.com/predict";
    const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyAEr5UTEfnHfpkYTPurq9SDgb0CkRCZAKY";

    if (req.file) {
      console.log("=== Step 1: Uploading Image to ImgBB ===");
      const formData = new FormData();
      formData.append("image", req.file.buffer.toString("base64"));

      const imgbbRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
        params: { key: imgbbKey },
        headers: formData.getHeaders()
      });

      imageUrl = imgbbRes.data.data.url;
      base64Image = req.file.buffer.toString("base64");
      mimeType = req.file.mimetype || "image/jpeg";
      console.log(`=== Step 1 Success: Image uploaded to ImgBB. URL: ${imageUrl} ===`);
    } else {
      console.log(`=== Step 1: Using provided Image URL: ${imageUrl} ===`);
      // Fetch image to get base64 for Gemini fallback
      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        base64Image = Buffer.from(response.data, 'binary').toString('base64');
        mimeType = response.headers['content-type'] || "image/jpeg";
      } catch (e) {
        console.error("Failed to fetch image from URL for base64 fallback:", e.message);
      }
    }

    let foodPrediction = "";
    let modelConfidence = 0; 

    try {
      console.log(`=== Step 2: Hitting custom Prediction API: ${predictionApiUrl} ===`);
      const predictRes = await axios.post(predictionApiUrl, {
        image_url: imageUrl
      }, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("=== Step 2 Success: Predict API Response: ===", predictRes.data);
      
      if (predictRes.data && predictRes.data.prediction) {
        foodPrediction = predictRes.data.prediction;
        modelConfidence = predictRes.data.confidence || 0;
        if (modelConfidence > 0 && modelConfidence <= 1) modelConfidence *= 100;

        const lowerPred = foodPrediction.toLowerCase().trim();
        if (lowerPred === "non_food" || lowerPred === "nonfood" || lowerPred === "non-food") {
          return res.status(400).json({ message: "This is not a food item. Please scan a valid food dish." });
        }
      }
    } catch (err) {
      console.error("=== Step 2 Error: Predict API Error ===", err.response?.data || err.message);
    }

    // Check if recipe already exists in DB
    if (foodPrediction) {
      const dishName = foodPrediction.replace(/_/g, " ").trim();
      const existingRecipe = await Recipe.findOne({ 
        $or: [
          { searchTitle: { $regex: new RegExp("^" + dishName + "$", "i") } },
          { title: { $regex: new RegExp(dishName, "i") } },
          { id: { $regex: new RegExp(dishName.toLowerCase().replace(/\s+/g, '-'), "i") } }
        ]
      });

      if (existingRecipe) {
        console.log(`=== Step 2.5: Recipe for "${dishName}" found in DB. Skipping Gemini. ===`);
        return res.json(existingRecipe);
      }
    }

    let activeDiets = [];
    if (req.body.dietaryPreferences) {
      try {
        const prefs = JSON.parse(req.body.dietaryPreferences);
        if (prefs.vegan) activeDiets.push("Vegan");
        if (prefs.vegetarian) activeDiets.push("Vegetarian");
        if (prefs.keto) activeDiets.push("Keto");
        if (prefs.glutenFree) activeDiets.push("Gluten-Free");
      } catch (e) {}
    }

    const pastRecipes = await Recipe.find({}).sort({ createdAt: -1 }).limit(10).select("title");
    const pastTitles = pastRecipes.map(r => r.title).join(", ");
    const historyPrompt = pastTitles ? `The user has recently scanned or cooked the following food items: [${pastTitles}]. Consider this food history to maintain variety and context.` : "";

    const dietPrompt = activeDiets.length > 0 ? `The user has strict dietary preferences: [${activeDiets.join(", ")}]. Make sure ALL generated ingredients and instructions perfectly align with these diet restrictions (e.g., use vegan alternatives if Vegan is selected).` : "";

    const isFallback = modelConfidence < 80;
    console.log(`=== Step 3: Gemini Fallback Status: ${isFallback} (Confidence: ${modelConfidence}%) ===`);

    const foodNamePrompt = (foodPrediction && !isFallback)
      ? `The dish has been classified as "${foodPrediction.replace(/_/g, " ")}". Use this specific classification to identify the meal and create the recipe.` 
      : `The identification model is uncertain (Confidence: ${modelConfidence}%). Please analyze the provided image yourself to identify the food item and then generate a detailed recipe for it.`;

    const promptText = `
      Analyze this food image. Return a JSON object containing the following exact fields:
      ${historyPrompt}
      ${dietPrompt}
      ${foodNamePrompt}
      - title (string)
      - description (string)
      - confidence (number 0-100)
      - cuisine (string)
      - calories (number)
      - protein (number)
      - fats (number)
      - carbs (number)
      - time (number, cooking/prep time in minutes)
      - rating (number 1-5, e.g. 4.8)
      - reviews (string, e.g. '120 Reviews')
      - difficulty (string, e.g. 'Easy', 'Medium', 'Hard')
      - tags (array of strings)
      - servings (number)
      - ingredients (array of objects with 'name' (string), 'checked' (boolean, false), and 'substitutes' (array of strings, provide 1-2 dietary or healthier alternatives if applicable, otherwise empty array))
      - instructions (array of objects with 'step' (number), 'title' (string), 'time' (string, e.g. '10m'), 'desc' (string))
      - history (object containing 'story' (string, fascinating origins or cultural context of the dish), 'image' (string, URL of the dish or use the same URL provided), and 'rank' (string, e.g. '#4 Global'))
      - trends (array of objects containing 'country' (string, e.g. 'India'), 'flag' (string, e.g. '🇮🇳'), and 'consumption' (number, between 1 to 100, representing the consumption popularity percentage in that country). Provide exactly 4 countries)

      Make the recipe realistic and based on what is visible in the image. Give it an appetizing title and description. Ensure accurate nutritional estimations.
      ${dietPrompt}
    `;

    const geminiParts = [{ text: promptText }];
    
    // Fallback: Send the actual image to Gemini if model confidence is low
    if (isFallback) {
      geminiParts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Image
        }
      });
    }

    const geminiData = {
      contents: [{ parts: geminiParts }],
      generationConfig: { responseMimeType: "application/json" }
    };

    console.log(`=== Step 3: Hitting Gemini API (Fallback: ${isFallback}) ===`);
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      geminiData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const geminiText = geminiRes.data.candidates[0].content.parts[0].text;
    let cleanText = geminiText.trim();
    const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/) || cleanText.match(/```\s*([\s\S]*?)\s*```/);
    if (match) cleanText = match[1].trim();

    const aiData = JSON.parse(cleanText);
    console.log("=== Step 3 Success: Cleaned AI Recipe Data: ===", aiData);

    const newId = `scanned-${Date.now()}`;
    const newRecipe = new Recipe({
      id: newId,
      ...aiData,
      searchTitle: foodPrediction ? foodPrediction.replace(/_/g, " ").trim() : aiData.title, // Save original name
      image: imageUrl, // Use the real scanned image
      confidence: aiData.confidence || modelConfidence || 94
    });

    await newRecipe.save();
    console.log(`=== Step 4: Recipe saved successfully with ID: ${newId} ===`);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Scan Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Search and generate a recipe from a food name using Gemini
router.post("/search-generate", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Search query required" });

    // 1. Check if recipe already exists in DB (Robust check)
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');
    const existingRecipe = await Recipe.findOne({ 
      $or: [
        { searchTitle: { $regex: new RegExp("^" + normalizedQuery + "$", "i") } }, // Exact match on original search
        { title: { $regex: new RegExp(normalizedQuery, "i") } },
        { id: { $regex: new RegExp(normalizedQuery.toLowerCase().replace(/\s+/g, '-'), "i") } }
      ]
    });

    if (existingRecipe) {
      console.log(`=== Step 0.5: Recipe for "${query}" found in DB (SearchTitle Match). Skipping Gemini. ===`);
      return res.json(existingRecipe);
    }

    // 2. Fetch High-Quality Image from Pixabay
    const pixabayImage = await fetchPixabayImage(query);

    const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyAEr5UTEfnHfpkYTPurq9SDgb0CkRCZAKY";

    console.log(`=== Step 1: Generating recipe for "${query}" using Gemini ===`);

    const promptText = `
      You are a Michelin-star chef and food historian. Generate a detailed, high-quality recipe for "${query}".
      Return a JSON object containing the following exact fields:
      - title (string)
      - description (string)
      - cuisine (string)
      - calories (number)
      - protein (number)
      - fats (number)
      - carbs (number)
      - time (number)
      - rating (number)
      - reviews (string)
      - difficulty (string)
      - tags (array of strings)
      - servings (number)
      - ingredients (array of objects with 'name' (string), 'checked' (boolean, false), and 'substitutes' (array of strings))
      - instructions (array of objects with 'step' (number), 'title' (string), 'time' (string), 'desc' (string))
      - history (object containing 'story' (string), 'rank' (string))
      - trends (array of objects containing 'country' (string), 'flag' (string), and 'consumption' (number). Provide exactly 4 countries)
    `;

    const geminiData = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: "application/json" }
    };

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      geminiData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const geminiText = geminiRes.data.candidates[0].content.parts[0].text;
    let cleanText = geminiText.trim();
    const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/) || cleanText.match(/```\s*([\s\S]*?)\s*```/);
    if (match) cleanText = match[1].trim();

    const aiData = JSON.parse(cleanText);
    console.log("=== Step 1 Success: Generated Recipe Data: ===", aiData);

    const newId = `generated-${Date.now()}`;
    const newRecipe = new Recipe({
      id: newId,
      ...aiData,
      searchTitle: query.trim(), // Crucial: Save the exact name we used to search
      image: pixabayImage, // Use Pixabay image
      history: {
        ...aiData.history,
        image: pixabayImage // Also use for history
      },
      confidence: 100
    });

    await newRecipe.save();
    console.log(`=== Step 2: Recipe for "${query}" saved with ID: ${newId} ===`);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Generate Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
