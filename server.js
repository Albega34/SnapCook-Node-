import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Import Modular Routes
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recommendationsRoutes from "./routes/recommendationRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// API Routes
app.use("/api", recipeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/shopping-list", shoppingRoutes);
app.use("/api/meal-plans", mealPlanRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({ message: "SnapAndCook Backend API is up and running!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
