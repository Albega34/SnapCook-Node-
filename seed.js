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
    tags: ["Signature Recipe", "Vegetarian"],
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
      { step: 1, title: "Base Prep", time: "10m", desc: "Blanch tomatoes and cashews. Blend into a silky smooth puree. No lumps!" },
      { step: 2, title: "Aromatics", time: "5m", desc: "Melt butter. Sauté ginger-garlic paste until the raw smell fades." },
      { step: 3, title: "Simmering", time: "15m", desc: "Add puree, chili powder, and salt. Cook until butter separates from sides." },
      { step: 4, title: "Final Touch", time: "5m", desc: "Fold in paneer, cream, and kasuri methi. Garnish with coriander." }
    ],
    history: {
      story: "Paneer Butter Masala traces its roots to the legendary kitchens of Moti Mahal in post-partition Delhi. Developed by Kundan Lal Gujral, it was the vegetarian counterpart to Butter Chicken.",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop",
      rank: "#4 Global"
    },
    trends: [
      { country: "India", flag: "🇮🇳", consumption: 98 },
      { country: "UK", flag: "🇬🇧", consumption: 82 },
      { country: "USA", flag: "🇺🇸", consumption: 65 },
      { country: "Canada", flag: "🇨🇦", consumption: 58 }
    ]
  },
  {
    id: "honey-glazed-salmon",
    title: "Honey Glazed Salmon",
    description: "Delicious honey glazed salmon with a perfect balance of sweet and savory.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop",
    confidence: 94,
    cuisine: "Seafood",
    calories: 320,
    protein: 30,
    fats: 15,
    carbs: 10,
    time: 25,
    rating: 4.8,
    reviews: "1.2k",
    difficulty: "Easy",
    tags: ["Low Carb", "Keto", "Seafood"],
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
    history: {
      story: "Glazing fish with honey and soy is a technique that bridges East Asian flavors with Western seafood preparation, popular in coastal regions globally.",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
      rank: "#18 Seafood"
    },
    trends: [
      { country: "Norway", flag: "🇳🇴", consumption: 95 },
      { country: "USA", flag: "🇺🇸", consumption: 88 },
      { country: "Japan", flag: "🇯🇵", consumption: 72 },
      { country: "UK", flag: "🇬🇧", consumption: 64 }
    ]
  },
  {
    id: "mediterranean-buddha-bowl",
    title: "Mediterranean Buddha Bowl",
    description: "A healthy and filling bowl packed with protein and fresh veggies.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    confidence: 96,
    cuisine: "Mediterranean",
    calories: 410,
    protein: 18,
    fats: 20,
    carbs: 45,
    time: 15,
    rating: 4.9,
    reviews: "850",
    difficulty: "Easy",
    tags: ["Vegan", "Protein Rich", "Healthy"],
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
    history: {
      story: "The 'Buddha Bowl' concept originated from the practice of Zen monks who would carry a bowl and receive small portions of various foods as donations.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
      rank: "#12 Vegan"
    },
    trends: [
      { country: "Greece", flag: "🇬🇷", consumption: 96 },
      { country: "USA", flag: "🇺🇸", consumption: 90 },
      { country: "Australia", flag: "🇦🇺", consumption: 82 },
      { country: "Israel", flag: "🇮🇱", consumption: 78 }
    ]
  },
  {
    id: "avocado-toast-classic",
    title: "Classic Avocado Toast",
    description: "Creamy avocado on toasted sourdough with a hint of lemon and chili flakes. A perfect healthy breakfast.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop",
    confidence: 95,
    cuisine: "Modern Australian",
    calories: 280,
    protein: 8,
    fats: 18,
    carbs: 24,
    time: 10,
    rating: 4.7,
    reviews: "3.1k",
    difficulty: "Easy",
    tags: ["Vegan", "Breakfast", "Healthy"],
    servings: 1,
    ingredients: [
      { name: "1 slice Sourdough Bread", checked: false },
      { name: "1 ripe Avocado", checked: false },
      { name: "1 tsp Lemon Juice", checked: false },
      { name: "Red Chili Flakes", checked: false }
    ],
    instructions: [
      { step: 1, title: "Toast", time: "2m", desc: "Toast the sourdough bread until golden brown." },
      { step: 2, title: "Mash", time: "3m", desc: "Mash avocado with lemon juice and a pinch of salt." },
      { step: 3, title: "Assemble", time: "2m", desc: "Spread on toast and sprinkle with chili flakes." }
    ],
    history: {
      story: "While avocado has been consumed for centuries in Mexico, the modern 'Avocado Toast' craze began in Sydney, Australia, in the late 1990s.",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
      rank: "#1 Breakfast"
    },
    trends: [
      { country: "Australia", flag: "🇦🇺", consumption: 99 },
      { country: "USA", flag: "🇺🇸", consumption: 95 },
      { country: "UK", flag: "🇬🇧", consumption: 88 },
      { country: "New Zealand", flag: "🇳🇿", consumption: 82 }
    ]
  },
  {
    id: "chicken-alfredo-pasta",
    title: "Creamy Chicken Alfredo",
    description: "Rich and indulgent fettuccine pasta tossed in a creamy parmesan sauce with grilled chicken.",
    image: "https://images.unsplash.com/photo-1645112481341-6c43f188b1a6?q=80&w=1000&auto=format&fit=crop",
    confidence: 92,
    cuisine: "Italian",
    calories: 850,
    protein: 45,
    fats: 42,
    carbs: 65,
    time: 30,
    rating: 4.6,
    reviews: "5.4k",
    difficulty: "Medium",
    tags: ["High Protein", "Dinner", "Italian"],
    servings: 2,
    ingredients: [
      { name: "250g Fettuccine", checked: false },
      { name: "2 Chicken Breasts", checked: false },
      { name: "1 cup Heavy Cream", checked: false },
      { name: "1/2 cup Parmesan Cheese", checked: false }
    ],
    instructions: [
      { step: 1, title: "Boil", time: "10m", desc: "Cook pasta in salted boiling water." },
      { step: 2, title: "Grill", time: "12m", desc: "Season and grill chicken until cooked through." },
      { step: 3, title: "Sauce", time: "8m", desc: "Heat cream, stir in cheese until smooth, then toss with pasta and chicken." }
    ],
    history: {
      story: "Fettuccine Alfredo was created in 1914 by Alfredo di Lelio in Rome to help his wife regain her appetite after childbirth.",
      image: "https://images.unsplash.com/photo-1645112481341-6c43f188b1a6?q=80&w=800&auto=format&fit=crop",
      rank: "#7 Pasta"
    },
    trends: [
      { country: "USA", flag: "🇺🇸", consumption: 96 },
      { country: "Italy", flag: "🇮🇹", consumption: 85 },
      { country: "Brazil", flag: "🇧🇷", consumption: 74 },
      { country: "Mexico", flag: "🇲🇽", consumption: 68 }
    ]
  },
  {
    id: "greek-salad-fresh",
    title: "Zesty Greek Salad",
    description: "A refreshing mix of crisp cucumbers, tomatoes, olives, and feta cheese with a lemon-herb dressing.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop",
    confidence: 99,
    cuisine: "Greek",
    calories: 220,
    protein: 6,
    fats: 16,
    carbs: 12,
    time: 15,
    rating: 4.8,
    reviews: "920",
    difficulty: "Easy",
    tags: ["Vegetarian", "Lunch", "Low Carb"],
    servings: 2,
    ingredients: [
      { name: "2 Cucumbers, diced", checked: false },
      { name: "200g Feta Cheese", checked: false },
      { name: "1/2 cup Kalamata Olives", checked: false },
      { name: "Red Onion, sliced", checked: false }
    ],
    instructions: [
      { step: 1, title: "Chop", time: "10m", desc: "Chop all vegetables into bite-sized pieces." },
      { step: 2, title: "Mix", time: "5m", desc: "Toss with olive oil, lemon juice, and oregano." }
    ],
    history: {
      story: "Known in Greece as 'Horiatiki', this rustic salad was a staple for farmers who would take these simple ingredients to the fields.",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
      rank: "#2 Salad"
    },
    trends: [
      { country: "Greece", flag: "🇬🇷", consumption: 99 },
      { country: "Cyprus", flag: "🇨🇾", consumption: 92 },
      { country: "Germany", flag: "🇩🇪", consumption: 80 },
      { country: "USA", flag: "🇺🇸", consumption: 75 }
    ]
  },
  {
    id: "beef-tacos-mexican",
    title: "Authentic Beef Tacos",
    description: "Savory seasoned ground beef served in soft corn tortillas with fresh salsa and lime.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop",
    confidence: 94,
    cuisine: "Mexican",
    calories: 450,
    protein: 28,
    fats: 24,
    carbs: 32,
    time: 20,
    rating: 4.9,
    reviews: "1.8k",
    difficulty: "Easy",
    tags: ["Dinner", "Mexican", "Quick"],
    servings: 3,
    ingredients: [
      { name: "500g Ground Beef", checked: false },
      { name: "Corn Tortillas", checked: false },
      { name: "Fresh Cilantro", checked: false },
      { name: "Lime Wedges", checked: false }
    ],
    instructions: [
      { step: 1, title: "Brown", time: "10m", desc: "Cook beef with taco seasoning until browned." },
      { step: 2, title: "Heat", time: "5m", desc: "Warm tortillas on a flat pan." },
      { step: 3, title: "Serve", time: "5m", desc: "Fill tortillas with beef and top with cilantro and lime." }
    ],
    history: {
      story: "Tacos originated in Mexican silver mines in the 18th century. The word 'taco' originally referred to the small explosives used to extract ore.",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop",
      rank: "#1 Mexican"
    },
    trends: [
      { country: "Mexico", flag: "🇲🇽", consumption: 99 },
      { country: "USA", flag: "🇺🇸", consumption: 96 },
      { country: "Spain", flag: "🇪🇸", consumption: 78 },
      { country: "Brazil", flag: "🇧🇷", consumption: 65 }
    ]
  },
  {
    id: "miso-soup-traditional",
    title: "Traditional Miso Soup",
    description: "A warming Japanese staple made with dashi, miso paste, tofu, and seaweed.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop",
    confidence: 97,
    cuisine: "Japanese",
    calories: 80,
    protein: 6,
    fats: 3,
    carbs: 8,
    time: 10,
    rating: 4.5,
    reviews: "640",
    difficulty: "Easy",
    tags: ["Vegetarian", "Side Dish", "Healthy"],
    servings: 2,
    ingredients: [
      { name: "4 cups Dashi Stock", checked: false },
      { name: "3 tbsp Miso Paste", checked: false },
      { name: "Silken Tofu, cubed", checked: false },
      { name: "Dried Wakame Seaweed", checked: false }
    ],
    instructions: [
      { step: 1, title: "Simmer", time: "5m", desc: "Heat dashi stock and add seaweed/tofu." },
      { step: 2, title: "Dissolve", time: "5m", desc: "Whisk in miso paste just before serving. Do not boil." }
    ],
    history: {
      story: "Miso has been a Japanese staple since the 8th century. It was originally a luxury item but became common among samurai for its nutritional value.",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
      rank: "#1 Japanese Side"
    },
    trends: [
      { country: "Japan", flag: "🇯🇵", consumption: 99 },
      { country: "Taiwan", flag: "🇹🇼", consumption: 85 },
      { country: "USA", flag: "🇺🇸", consumption: 72 },
      { country: "France", flag: "🇫🇷", consumption: 60 }
    ]
  },
  {
    id: "quinoa-stuffed-peppers",
    title: "Quinoa Stuffed Peppers",
    description: "Colorful bell peppers stuffed with a savory mix of quinoa, black beans, and corn.",
    image: "https://images.unsplash.com/photo-1590137876181-2a5a7e34030d?q=80&w=1000&auto=format&fit=crop",
    confidence: 91,
    cuisine: "Plant-Based",
    calories: 320,
    protein: 14,
    fats: 10,
    carbs: 48,
    time: 40,
    rating: 4.7,
    reviews: "1.1k",
    difficulty: "Medium",
    tags: ["Vegan", "High Fiber", "Dinner"],
    servings: 2,
    ingredients: [
      { name: "2 Bell Peppers", checked: false },
      { name: "1 cup Quinoa, cooked", checked: false },
      { name: "1/2 cup Black Beans", checked: false },
      { name: "1/2 cup Corn", checked: false }
    ],
    instructions: [
      { step: 1, title: "Prep", time: "10m", desc: "Cut tops off peppers and remove seeds." },
      { step: 2, title: "Stuff", time: "5m", desc: "Mix quinoa, beans, and corn, then stuff into peppers." },
      { step: 3, title: "Bake", time: "25m", desc: "Bake at 375°F until peppers are tender." }
    ],
    history: {
      story: "Stuffed vegetables are a global phenomenon, but the quinoa variation gained massive popularity with the rise of ancient grains in the early 2010s.",
      image: "https://images.unsplash.com/photo-1590137876181-2a5a7e34030d?q=80&w=800&auto=format&fit=crop",
      rank: "#23 Plant-Based"
    },
    trends: [
      { country: "USA", flag: "🇺🇸", consumption: 92 },
      { country: "Peru", flag: "🇵🇪", consumption: 85 },
      { country: "UK", flag: "🇬🇧", consumption: 76 },
      { country: "Germany", flag: "🇩🇪", consumption: 68 }
    ]
  },
  {
    id: "grilled-cheese-gourmet",
    title: "Gourmet Grilled Cheese",
    description: "A blend of aged cheddar and gruyère on buttery sourdough, grilled to perfection.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1000&auto=format&fit=crop",
    confidence: 98,
    cuisine: "American",
    calories: 550,
    protein: 18,
    fats: 32,
    carbs: 40,
    time: 10,
    rating: 4.9,
    reviews: "4.2k",
    difficulty: "Easy",
    tags: ["Vegetarian", "Lunch", "Comfort Food"],
    servings: 1,
    ingredients: [
      { name: "2 slices Sourdough", checked: false },
      { name: "Cheddar Cheese", checked: false },
      { name: "Gruyère Cheese", checked: false },
      { name: "Butter", checked: false }
    ],
    instructions: [
      { step: 1, title: "Butter", time: "2m", desc: "Butter the outside of each bread slice." },
      { step: 2, title: "Grill", time: "8m", desc: "Cook in a pan over medium heat until cheese is melted and bread is crispy." }
    ],
    history: {
      story: "The modern grilled cheese became popular during the Great Depression when 'toasted cheese' sandwiches were a cheap, filling meal.",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop",
      rank: "#3 Comfort Food"
    },
    trends: [
      { country: "USA", flag: "🇺🇸", consumption: 99 },
      { country: "Canada", flag: "🇨🇦", consumption: 94 },
      { country: "UK", flag: "🇬🇧", consumption: 82 },
      { country: "Australia", flag: "🇦🇺", consumption: 75 }
    ]
  },
  {
    id: "berry-smoothie-bowl",
    title: "Berry Smoothie Bowl",
    description: "A thick and creamy blend of mixed berries and banana, topped with granola and seeds.",
    image: "https://images.unsplash.com/photo-1494597564530-897b7a216577?q=80&w=1000&auto=format&fit=crop",
    confidence: 96,
    cuisine: "Healthy",
    calories: 310,
    protein: 7,
    fats: 6,
    carbs: 62,
    time: 10,
    rating: 4.8,
    reviews: "2.1k",
    difficulty: "Easy",
    tags: ["Vegan", "Breakfast", "Fruit"],
    servings: 1,
    ingredients: [
      { name: "1 cup Frozen Berries", checked: false },
      { name: "1 Frozen Banana", checked: false },
      { name: "1/2 cup Almond Milk", checked: false },
      { name: "Granola for topping", checked: false }
    ],
    instructions: [
      { step: 1, title: "Blend", time: "5m", desc: "Blend berries, banana, and milk until thick." },
      { step: 2, title: "Top", time: "5m", desc: "Pour into a bowl and add toppings." }
    ],
    history: {
      story: "Smoothie bowls became an Instagram sensation in 2015, popularized by health influencers for their vibrant colors and nutritional density.",
      image: "https://images.unsplash.com/photo-1494597564530-897b7a216577?q=80&w=800&auto=format&fit=crop",
      rank: "#5 Healthy Breakfast"
    },
    trends: [
      { country: "USA", flag: "🇺🇸", consumption: 95 },
      { country: "Australia", flag: "🇦🇺", consumption: 90 },
      { country: "UK", flag: "🇬🇧", consumption: 85 },
      { country: "Brazil", flag: "🇧🇷", consumption: 78 }
    ]
  },
  {
    id: "steak-with-asparagus",
    title: "Seared Steak & Asparagus",
    description: "Juicy ribeye steak seared with garlic butter and served with tender grilled asparagus.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop",
    confidence: 93,
    cuisine: "Steakhouse",
    calories: 680,
    protein: 52,
    fats: 48,
    carbs: 8,
    time: 25,
    rating: 4.9,
    reviews: "1.5k",
    difficulty: "Medium",
    tags: ["Keto", "High Protein", "Dinner"],
    servings: 1,
    ingredients: [
      { name: "1 Ribeye Steak", checked: false },
      { name: "Bunch of Asparagus", checked: false },
      { name: "Garlic Butter", checked: false }
    ],
    instructions: [
      { step: 1, title: "Sear", time: "15m", desc: "Sear steak in a hot cast-iron skillet to desired doneness." },
      { step: 2, title: "Sauté", time: "10m", desc: "Sauté asparagus in the same pan with garlic butter." }
    ],
    history: {
      story: "Steak and asparagus is the quintessential 'meat and veg' meal, a staple of high-end steakhouses and healthy keto lifestyles alike.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
      rank: "#2 Keto Dinner"
    },
    trends: [
      { country: "USA", flag: "🇺🇸", consumption: 98 },
      { country: "Argentina", flag: "🇦🇷", consumption: 95 },
      { country: "Australia", flag: "🇦🇺", consumption: 92 },
      { country: "France", flag: "🇫🇷", consumption: 84 }
    ]
  },
  {
    id: "vegetable-stir-fry",
    title: "Spicy Vegetable Stir Fry",
    description: "A quick and colorful stir fry of fresh vegetables in a spicy ginger-soy sauce.",
    image: "https://images.unsplash.com/photo-1512058560550-42749359a767?q=80&w=1000&auto=format&fit=crop",
    confidence: 95,
    cuisine: "Asian",
    calories: 240,
    protein: 9,
    fats: 8,
    carbs: 34,
    time: 15,
    rating: 4.7,
    reviews: "1.3k",
    difficulty: "Easy",
    tags: ["Vegan", "Quick", "Dinner"],
    servings: 2,
    ingredients: [
      { name: "Mixed Vegetables", checked: false },
      { name: "Tofu, cubed", checked: false },
      { name: "Soy Sauce", checked: false },
      { name: "Fresh Ginger", checked: false }
    ],
    instructions: [
      { step: 1, title: "Stir Fry", time: "10m", desc: "Sauté vegetables and tofu over high heat." },
      { step: 2, title: "Sauce", time: "5m", desc: "Add soy sauce and ginger, toss until well coated." }
    ],
    history: {
      story: "Stir-frying (chǎo) is a Chinese cooking technique that became popular during the Ming Dynasty for its efficiency and nutrient retention.",
      image: "https://images.unsplash.com/photo-1512058560550-42749359a767?q=80&w=800&auto=format&fit=crop",
      rank: "#9 Asian"
    },
    trends: [
      { country: "China", flag: "🇨🇳", consumption: 99 },
      { country: "Thailand", flag: "🇹🇭", consumption: 92 },
      { country: "USA", flag: "🇺🇸", consumption: 88 },
      { country: "UK", flag: "🇬🇧", consumption: 80 }
    ]
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
