import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { Recipe } from "../models/Recipe.js";

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
    if (!req.file) return res.status(400).json({ message: "Image file required" });

    const imgbbKey = process.env.IMGBB_API_KEY || "031f6c420634cd1572b116f59a52abea";
    const predictionApiUrl = process.env.PREDICTION_API_URL || "https://snapcook-model.onrender.com/predict";
    const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyAEr5UTEfnHfpkYTPurq9SDgb0CkRCZAKY";

    console.log("=== Step 1: Uploading Image to ImgBB ===");
    const formData = new FormData();
    formData.append("image", req.file.buffer.toString("base64"));

    const imgbbRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
      params: { key: imgbbKey },
      headers: formData.getHeaders()
    });

    const imageUrl = imgbbRes.data.data.url;
    console.log(`=== Step 1 Success: Image uploaded to ImgBB. URL: ${imageUrl} ===`);

    let foodPrediction = "";
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
        const lowerPred = foodPrediction.toLowerCase().trim();
        if (lowerPred === "non_food" || lowerPred === "nonfood" || lowerPred === "non-food") {
          console.log(`=== Step 2 detected non-food item: "${foodPrediction}". Aborting Gemini API call. ===`);
          return res.status(400).json({ message: "This is not a food item. Please scan a valid food dish." });
        }
      }
    } catch (err) {
      console.error("=== Step 2 Error: Predict API Error ===", err.response?.data || err.message);
    }

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    let activeDiets = [];
    if (req.body.dietaryPreferences) {
      try {
        const prefs = JSON.parse(req.body.dietaryPreferences);
        if (prefs.vegan) activeDiets.push("Vegan");
        if (prefs.vegetarian) activeDiets.push("Vegetarian");
        if (prefs.keto) activeDiets.push("Keto");
        if (prefs.glutenFree) activeDiets.push("Gluten-Free");
      } catch (e) {
        // ignore
      }
    }

    const pastRecipes = await Recipe.find({}).sort({ createdAt: -1 }).limit(10).select("title");
    const pastTitles = pastRecipes.map(r => r.title).join(", ");
    const historyPrompt = pastTitles ? `The user has recently scanned or cooked the following food items: [${pastTitles}]. Consider this food history to maintain variety and context.` : "";

    const dietPrompt = activeDiets.length > 0 ? `The user has strict dietary preferences: [${activeDiets.join(", ")}]. Make sure ALL generated ingredients and instructions perfectly align with these diet restrictions (e.g., use vegan alternatives if Vegan is selected).` : "";

    const foodNamePrompt = foodPrediction ? `The dish has been classified as "${foodPrediction.replace(/_/g, " ")}". Use this specific classification to identify the meal and create the recipe.` : "";

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

    const geminiData = {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    console.log("=== Step 3: Hitting Gemini API with text prompt ===");
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      geminiData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const geminiText = geminiRes.data.candidates[0].content.parts[0].text;
    console.log("=== Step 3 Success: Gemini API raw response ===");

    let cleanText = geminiText.trim();
    const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/) || cleanText.match(/```\s*([\s\S]*?)\s*```/);
    if (match) {
      cleanText = match[1].trim();
    }

    const aiData = JSON.parse(cleanText);

    const newId = `scanned-${Date.now()}`;
    const newRecipe = new Recipe({
      id: newId,
      title: aiData.title || "AI Scanned Dish",
      description: aiData.description || "Our AI analyzed this dish.",
      image: imageUrl,
      confidence: aiData.confidence || 94,
      cuisine: aiData.cuisine || "Global",
      calories: aiData.calories || 420,
      protein: aiData.protein || 24,
      fats: aiData.fats || 18,
      carbs: aiData.carbs || 35,
      time: aiData.time || 30,
      rating: aiData.rating || 4.8,
      reviews: aiData.reviews || "New Scan",
      difficulty: aiData.difficulty || "Medium",
      tags: aiData.tags || ["AI Detection", "Fresh Scan"],
      servings: aiData.servings || 1,
      ingredients: aiData.ingredients || [],
      instructions: aiData.instructions || [],
      history: aiData.history ? {
        story: aiData.history.story || "A dish rich in cultural heritage and flavors.",
        image: aiData.history.image || imageUrl,
        rank: aiData.history.rank || "#1 Trending"
      } : {
        story: "A dish rich in cultural heritage and flavors.",
        image: imageUrl,
        rank: "#1 Trending"
      },
      trends: aiData.trends || [
        { country: "India", flag: "🇮🇳", consumption: 98 },
        { country: "UK", flag: "🇬🇧", consumption: 85 },
        { country: "USA", flag: "🇺🇸", consumption: 72 },
        { country: "Australia", flag: "🇦🇺", consumption: 65 }
      ]
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Scan Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
