import mongoose from "mongoose";
import { Recipe } from "./models/Recipe.js";

const initialRecipes = [
  {
    id: "paneer-butter-masala",
    title: "Paneer Butter Masala",
    description: "Rich, creamy, and mildly spicy tomato-based gravy with soft cubes of paneer. Your scan suggests this dish has approximately 450 calories per serving.",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=1000&auto=format&fit=crop",
    confidence: 98,
    cuisine: "Indian Cuisine",
    calories: 450,
    protein: 15,
    fats: 22,
    carbs: 35,
    time: 45,
    rating: 4.9,
    reviews: "2.4k",
    difficulty: "Intermediate",
    tags: ["Signature Recipe"],
    servings: 2,
    ingredients: [
      { name: "250g Fresh Paneer Cubes", checked: false, substitutes: ["Extra Firm Tofu", "Tempeh"] },
      { name: "3 Large Tomatoes, Pureed", checked: false, substitutes: ["Canned Crushed Tomatoes"] },
      { name: "2 tbsp Salted Butter", checked: false, substitutes: ["Vegan Butter", "Olive Oil"] },
      { name: "10-12 Cashews (Paste)", checked: false, substitutes: ["Almond Paste", "Sunflower Seed Paste"] },
      { name: "1 tsp Ginger-Garlic Paste", checked: false, substitutes: [] },
      { name: "1 tsp Kashmiri Red Chili Powder", checked: false, substitutes: ["Paprika"] },
      { name: "1/2 cup Fresh Cream", checked: false, substitutes: ["Coconut Cream", "Cashew Cream"] },
      { name: "1 tsp Kasuri Methi", checked: false, substitutes: [] }
    ],
    instructions: [
      {
        step: 1,
        title: "Base Prep",
        time: "10m",
        desc: "Blanch tomatoes and cashews. Blend into a silky smooth puree. No lumps!"
      },
      {
        step: 2,
        title: "Aromatics",
        time: "5m",
        desc: "Melt butter. Sauté ginger-garlic paste until the raw smell fades."
      },
      {
        step: 3,
        title: "Simmering",
        time: "15m",
        desc: "Add puree, chili powder, and salt. Cook until butter separates from sides."
      },
      {
        step: 4,
        title: "Final Touch",
        time: "5m",
        desc: "Fold in paneer, cream, and kasuri methi. Garnish with coriander."
      }
    ],
    history: {
      story: "Paneer Butter Masala, or **Paneer Makhani**, traces its roots to the legendary kitchens of Moti Mahal in post-partition Delhi. Developed by Kundan Lal Gujral, it was the vegetarian counterpart to the world-famous Butter Chicken. For over 70 years, this dish has reigned supreme in Indian restaurants globally, symbolizing the rich, decadent hospitality of Punjabi culture.",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop",
      rank: "#4 Global"
    }
  },
  {
    id: "honey-glazed-salmon",
    title: "Honey Glazed Salmon",
    description: "Delicious honey glazed salmon with a perfect balance of sweet and savory.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop",
    confidence: null,
    cuisine: "Seafood",
    calories: 320,
    protein: 30,
    fats: 15,
    carbs: 10,
    time: 25,
    rating: 4.8,
    reviews: "1.2k",
    difficulty: "Easy",
    tags: ["Low Carb", "Keto"],
    servings: 2,
    ingredients: [
      { name: "2 Salmon Fillets", checked: false },
      { name: "2 tbsp Honey", checked: false },
      { name: "1 tbsp Soy Sauce", checked: false },
      { name: "1 clove Garlic, minced", checked: false }
    ],
    instructions: [
      { step: 1, title: "Prep", time: "5m", desc: "Mix honey, soy sauce, and garlic." },
      { step: 2, title: "Cook", time: "20m", desc: "Bake salmon at 400°F for 15-20 minutes, brushing with glaze." }
    ],
    history: null
  },
  {
    id: "mediterranean-buddha-bowl",
    title: "Mediterranean Buddha Bowl",
    description: "A healthy and filling bowl packed with protein and fresh veggies.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    confidence: null,
    cuisine: "Mediterranean",
    calories: 410,
    protein: 18,
    fats: 20,
    carbs: 45,
    time: 15,
    rating: 4.9,
    reviews: "850",
    difficulty: "Easy",
    tags: ["Vegan", "Protein Rich"],
    servings: 1,
    ingredients: [
      { name: "1 cup Quinoa, cooked", checked: false },
      { name: "1/2 cup Hummus", checked: false },
      { name: "1 cup Mixed Greens", checked: false },
      { name: "1/4 cup Kalamata Olives", checked: false }
    ],
    instructions: [
      { step: 1, title: "Assemble", time: "15m", desc: "Layer ingredients in a bowl and top with your favorite dressing." }
    ],
    history: null
  }
];

mongoose.connect("mongodb://127.0.0.1:27017/snapandcook")
  .then(async () => {
    console.log("Connected to MongoDB");
    await Recipe.deleteMany({});
    await Recipe.insertMany(initialRecipes);
    console.log("Database Seeded!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
