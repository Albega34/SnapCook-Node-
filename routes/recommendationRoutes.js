import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const dummyRecipes = [
      {
        title: "Creamy Vegan Pasta",
        description: "A rich, creamy cashew-based sauce tossed with wild mushrooms and fresh spinach over rigatoni.",
        calories: 450,
        time: 25,
        difficulty: "Easy",
        tags: ["Vegan", "Pasta"]
      },
      {
        title: "Keto Avocado Salad",
        description: "Fresh spinach, cherry tomatoes, and sliced avocado tossed in a vibrant lemon-herb olive oil dressing.",
        calories: 320,
        time: 10,
        difficulty: "Easy",
        tags: ["Keto", "Salad"]
      },
      {
        title: "Gluten-Free Almond Bread",
        description: "Crispy, homemade artisan bread baked with almond and coconut flour, and topped with sea salt.",
        calories: 210,
        time: 45,
        difficulty: "Medium",
        tags: ["Gluten-Free", "Bread"]
      },
      {
        title: "Zesty Chickpea Salad",
        description: "Nutritious chickpeas combined with diced cucumber, red onions, bell peppers, and tahini dressing.",
        calories: 380,
        time: 15,
        difficulty: "Easy",
        tags: ["Vegetarian", "High-Fiber"]
      },
      {
        title: "Keto Cauliflower Fried Rice",
        description: "Grated cauliflower florets sautéed with toasted sesame oil, ginger, egg, and colorful mixed greens.",
        calories: 280,
        time: 20,
        difficulty: "Easy",
        tags: ["Keto", "Low-Carb"]
      },
      {
        title: "Crispy Baked Tofu Bowls",
        description: "Gluten-free oven-roasted extra firm tofu marinated in sweet soy and served over warm brown rice.",
        calories: 410,
        time: 30,
        difficulty: "Medium",
        tags: ["Vegan", "Gluten-Free"]
      },
      {
        title: "Classic Vegetable Biryani",
        description: "Aromatic basmati rice cooked with whole spices, soft potatoes, green peas, and fresh mint leaves.",
        calories: 510,
        time: 40,
        difficulty: "Medium",
        tags: ["Vegetarian", "Rice"]
      },
      {
        title: "Protein Berry Smoothie",
        description: "A thick, satisfying blend of pea protein, frozen blueberries, flaxseeds, and unsweetened almond milk.",
        calories: 240,
        time: 5,
        difficulty: "Easy",
        tags: ["Vegan", "Breakfast"]
      },
      {
        title: "Spicy Lentil Curry",
        description: "Hearty red lentils simmered in coconut milk, turmeric, cumin, and fresh cilantro leaves.",
        calories: 420,
        time: 35,
        difficulty: "Medium",
        tags: ["Vegan", "Curry"]
      },
      {
        title: "Gluten-Free Oat Pancakes",
        description: "Light, fluffy pancakes made from finely milled gluten-free rolled oats and maple syrup.",
        calories: 350,
        time: 20,
        difficulty: "Easy",
        tags: ["Gluten-Free", "Breakfast"]
      },
      {
        title: "Keto Spinach and Feta Omelet",
        description: "Three cage-free eggs cooked in butter with cream cheese, fresh spinach, and rich Greek feta.",
        calories: 490,
        time: 12,
        difficulty: "Easy",
        tags: ["Keto", "Breakfast"]
      },
      {
        title: "Grilled Sweet Potato Steaks",
        description: "Thick-cut sweet potatoes brushed with maple glaze, garlic powder, and roasted until perfectly caramelized.",
        calories: 310,
        time: 28,
        difficulty: "Easy",
        tags: ["Vegan", "Gluten-Free"]
      },
      {
        title: "Mushroom Stroganoff",
        description: "Sautéed wild cremini and button mushrooms in a delicious gluten-free savory gravy.",
        calories: 390,
        time: 30,
        difficulty: "Medium",
        tags: ["Vegetarian", "Gluten-Free"]
      },
      {
        title: "Mediterranean Quinoa Bowl",
        description: "Steamed fluffy quinoa mixed with kalamata olives, cucumber, parsley, and house olive oil.",
        calories: 360,
        time: 18,
        difficulty: "Easy",
        tags: ["Vegan", "High-Protein"]
      },
      {
        title: "Spiced Pumpkin Soup",
        description: "Thick pumpkin purée simmered with fresh coconut cream, white pepper, and toasted pumpkin seeds.",
        calories: 210,
        time: 25,
        difficulty: "Easy",
        tags: ["Vegan", "Soup"]
      },
      {
        title: "Low-Carb Zucchini Noodles",
        description: "Tender spiraled zucchini sautéed with cherry tomatoes, fresh garlic cloves, and toasted pine nuts.",
        calories: 190,
        time: 15,
        difficulty: "Easy",
        tags: ["Keto", "Low-Carb"]
      },
      {
        title: "Garlic Roasted Broccoli",
        description: "Oven-roasted crisp broccoli florets tossed with toasted pine nuts, shaved lemon zest, and olive oil.",
        calories: 160,
        time: 20,
        difficulty: "Easy",
        tags: ["Vegan", "Keto"]
      },
      {
        title: "Chocolate Avocado Mousse",
        description: "Smooth, velvety dessert whipped with ripe avocado, unsweetened cocoa powder, and organic agave.",
        calories: 270,
        time: 10,
        difficulty: "Easy",
        tags: ["Vegan", "Dessert"]
      },
      {
        title: "Spicy Jackfruit Tacos",
        description: "Shredded, tender green jackfruit tossed in homemade adobo seasoning and served in warm corn tortillas.",
        calories: 320,
        time: 22,
        difficulty: "Medium",
        tags: ["Vegan", "Tacos"]
      },
      {
        title: "Warm Chia Pudding",
        description: "Nutritious chia seeds soaked overnight in warm coconut milk, then topped with slivered almonds.",
        calories: 280,
        time: 5,
        difficulty: "Easy",
        tags: ["Vegan", "Keto"]
      }
    ];

    const shuffled = [...dummyRecipes].sort(() => 0.5 - Math.random());
    const recommendations = shuffled.slice(0, 4);
    res.json(recommendations);
  } catch (error) {
    console.error("Recommendations Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
