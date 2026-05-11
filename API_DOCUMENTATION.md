# 📡 SnapAndCook — Complete API Documentation

> **Base URL:** `http://localhost:5000`  
> **Database:** MongoDB (via Mongoose)  
> **Framework:** Node.js + Express.js  
> **Port:** `5000` (configurable via `.env`)

---

## 🟢 Health Check

### `GET /`

Checks if the backend server is up and running.

| Field      | Value                                          |
|------------|------------------------------------------------|
| Method     | `GET`                                          |
| URL        | `http://localhost:5000/`                       |
| Auth       | None                                           |

**Response (200 OK):**
```json
{
  "message": "SnapAndCook Backend API is up and running!"
}
```

---

## 🍽️ Recipe APIs

> **Base Path:** `/api/recipes`  
> **Route File:** `backend/routes/recipeRoutes.js`  
> **Model:** `Recipe`

---

### 1. `GET /api/recipes` — Get All Recipes

**What it does:**  
Fetches all the recipes stored in MongoDB, sorted from newest to oldest. This is called by the **Dashboard page** to populate the recipe cards and compute nutrition totals (calories, protein, carbs, fats).

| Field      | Value                    |
|------------|--------------------------|
| Method     | `GET`                    |
| URL        | `/api/recipes`           |
| Auth       | None                     |
| Body       | None                     |

**Response (200 OK):**
```json
[
  {
    "_id": "...",
    "id": "scanned-1714900000000",
    "title": "Butter Chicken",
    "description": "Creamy, spiced tomato-based chicken curry.",
    "image": "https://i.ibb.co/xyz.jpg",
    "confidence": 95,
    "cuisine": "Indian",
    "calories": 520,
    "protein": 35,
    "fats": 22,
    "carbs": 40,
    "time": 45,
    "rating": 4.8,
    "reviews": "240 Reviews",
    "difficulty": "Medium",
    "tags": ["Indian", "Curry", "Non-Veg"],
    "servings": 2,
    "ingredients": [...],
    "instructions": [...],
    "history": { "story": "...", "image": "...", "rank": "#2 Global" },
    "trends": [...]
  }
]
```

**Used by:** `Dashboard.jsx` (lines 36–55), `Recipes.jsx`

---

### 2. `GET /api/recipes/:id` — Get Single Recipe

**What it does:**  
Fetches one specific recipe by its custom `id` field (e.g., `scanned-1714900000000`). Used in the **Recipe Detail page** to load full instructions, ingredients, history, and trends for a dish.

| Field      | Value                    |
|------------|--------------------------|
| Method     | `GET`                    |
| URL        | `/api/recipes/:id`       |
| URL Param  | `id` — the custom string ID of the recipe |
| Auth       | None                     |

**Example Request:**
```
GET /api/recipes/scanned-1714900000000
```

**Response (200 OK):**  
Returns the full Recipe object (same shape as above).

**Response (404 Not Found):**
```json
{ "message": "Recipe not found" }
```

**Used by:** `RecipeDetail.jsx`

---

### 3. `POST /api/scan` — 🤖 Scan & Identify Food Image

**What it does:**  
This is the **core AI-powered endpoint** of SnapAndCook. It takes an uploaded food image and performs a 3-step pipeline:

#### 🔄 Processing Pipeline

```
User uploads image
       │
       ▼
 Step 1: Upload to ImgBB
 (get a public image URL)
       │
       ▼
 Step 2: Send URL to Custom TFLite Prediction API
 (classify the food dish — e.g., "Butter_Chicken")
 ↳ If non-food detected → reject with 400 error
       │
       ▼
 Step 3: Send image + classification to Gemini Vision API
 (generate full recipe JSON with ingredients, nutrition, etc.)
       │
       ▼
 Save recipe to MongoDB → Return full recipe to client
```

| Field        | Value                                            |
|--------------|--------------------------------------------------|
| Method       | `POST`                                           |
| URL          | `/api/scan`                                      |
| Content-Type | `multipart/form-data`                            |
| Auth         | None                                             |

**Request Body (form-data):**

| Field               | Type   | Required | Description                              |
|---------------------|--------|----------|------------------------------------------|
| `image`             | File   | ✅ Yes    | The food image file (jpeg/png)           |
| `dietaryPreferences`| String | ❌ No     | JSON string of diet flags (see below)    |

**`dietaryPreferences` format:**
```json
{
  "vegan": false,
  "vegetarian": true,
  "keto": false,
  "glutenFree": false
}
```

**What each step calls:**

| Step | External API            | Purpose                                      |
|------|------------------------|----------------------------------------------|
| 1    | ImgBB API              | Upload image and get a hosted public URL     |
| 2    | `snapcook-model.onrender.com/predict` | TFLite model to classify food dish |
| 3    | Google Gemini API (`gemini-flash-latest`) | Generate full recipe JSON |

**Response (201 Created):**  
Returns the newly created Recipe object saved in MongoDB.

**Response (400 Bad Request):**
```json
{ "message": "Image file required" }
// or
{ "message": "This is not a food item. Please scan a valid food dish." }
```

**Response (500 Server Error):**
```json
{ "message": "Server Error", "error": "..." }
```

**Used by:** `Dashboard.jsx` (upload handler / scan button)

**Generated Recipe Fields:**
| Field         | Type             | Description                                |
|---------------|------------------|--------------------------------------------|
| `title`       | String           | Name of the dish                           |
| `description` | String           | Short appealing description                |
| `confidence`  | Number (0–100)   | AI confidence in identification            |
| `cuisine`     | String           | Cuisine type (e.g., "Indian", "Italian")   |
| `calories`    | Number           | Estimated calories per serving             |
| `protein`     | Number           | Protein in grams                           |
| `fats`        | Number           | Fat content in grams                       |
| `carbs`       | Number           | Carbohydrate content in grams              |
| `time`        | Number           | Cooking time in minutes                    |
| `rating`      | Number (1–5)     | AI-assigned quality rating                 |
| `difficulty`  | String           | `Easy`, `Medium`, or `Hard`               |
| `tags`        | String[]         | Category tags (e.g., `["Vegan", "Curry"]`) |
| `servings`    | Number           | Number of servings                         |
| `ingredients` | Object[]         | Each with `name`, `checked`, `substitutes` |
| `instructions`| Object[]         | Each with `step`, `title`, `time`, `desc` |
| `history`     | Object           | `story`, `image`, `rank` (cultural info)   |
| `trends`      | Object[]         | 4 countries with `flag` and `consumption %`|

---

## 👤 User APIs

> **Base Path:** `/api/user`  
> **Route File:** `backend/routes/userRoutes.js`  
> **Model:** `User`

---

### 4. `GET /api/user/profile` — Get User Profile

**What it does:**  
Fetches the profile for the default user (`default_user`). If no user exists yet in the database, it automatically creates one with default values. Stores dietary preferences and daily calorie goal.

| Field  | Value                      |
|--------|----------------------------|
| Method | `GET`                      |
| URL    | `/api/user/profile`        |
| Auth   | None                       |

**Response (200 OK):**
```json
{
  "_id": "...",
  "id": "default_user",
  "name": "Chef",
  "dietaryPreferences": {
    "vegan": false,
    "vegetarian": false,
    "keto": false,
    "glutenFree": false
  },
  "dailyCaloriesGoal": 2000
}
```

**Used by:** `Dashboard.jsx` (to pre-fill diet toggle states)

---

### 5. `POST /api/user/profile` — Update Dietary Preferences

**What it does:**  
Updates the user's dietary preferences (vegan, vegetarian, keto, gluten-free) stored in MongoDB. If no user exists, it creates one. Used when the user saves preferences from the Diet Preferences modal on the Dashboard.

| Field        | Value                      |
|--------------|----------------------------|
| Method       | `POST`                     |
| URL          | `/api/user/profile`        |
| Content-Type | `application/json`         |
| Auth         | None                       |

**Request Body:**
```json
{
  "dietaryPreferences": {
    "vegan": true,
    "vegetarian": false,
    "keto": false,
    "glutenFree": true
  }
}
```

**Response (200 OK):**  
Returns the updated User object.

**Used by:** `Dashboard.jsx` (Diet Preferences modal — Save button)

---

## 🛒 Shopping List APIs

> **Base Path:** `/api/shopping-list`  
> **Route File:** `backend/routes/shoppingRoutes.js`  
> **Model:** `ShoppingList`

---

### 6. `GET /api/shopping-list` — Get Shopping List

**What it does:**  
Fetches the current shopping list for the default user. If no list exists yet, it automatically creates an empty one. The shopping list stores ingredient names and their checked/unchecked state.

| Field  | Value                          |
|--------|--------------------------------|
| Method | `GET`                          |
| URL    | `/api/shopping-list`           |
| Auth   | None                           |

**Response (200 OK):**
```json
{
  "_id": "...",
  "userId": "default_user",
  "items": [
    { "_id": "...", "name": "Chicken Breast", "checked": false },
    { "_id": "...", "name": "Tomatoes", "checked": true }
  ]
}
```

**Used by:** `ShoppingList.jsx` page

---

### 7. `POST /api/shopping-list` — Add Items to Shopping List

**What it does:**  
Adds new ingredient items to the user's shopping list. It checks for **duplicates** — if an item with the same name (case-insensitive) already exists, it is **not added again**. This is called when a user clicks "Add to Shopping List" from a recipe's ingredient section.

| Field        | Value                          |
|--------------|--------------------------------|
| Method       | `POST`                         |
| URL          | `/api/shopping-list`           |
| Content-Type | `application/json`             |
| Auth         | None                           |

**Request Body:**
```json
{
  "items": ["Chicken Breast", "Garlic", "Tomatoes", "Ginger"]
}
```

**Response (200 OK):**  
Returns the full updated ShoppingList document.

**Used by:** `RecipeDetail.jsx` (Add to Shopping List button)

---

### 8. `DELETE /api/shopping-list/:itemId` — Remove Item from Shopping List

**What it does:**  
Deletes a single item from the shopping list using its MongoDB `_id`. Used when the user clicks the remove/delete icon next to a shopping list item.

| Field     | Value                                    |
|-----------|------------------------------------------|
| Method    | `DELETE`                                 |
| URL       | `/api/shopping-list/:itemId`             |
| URL Param | `itemId` — MongoDB `_id` of the item     |
| Auth      | None                                     |

**Example Request:**
```
DELETE /api/shopping-list/663e1a2f9b4c3d001e8a5f0c
```

**Response (200 OK):**  
Returns the updated ShoppingList document with the item removed.

**Used by:** `ShoppingList.jsx` (delete button per item)

---

## 📅 Meal Plan APIs

> **Base Path:** `/api/meal-plans`  
> **Route File:** `backend/routes/mealPlanRoutes.js`  
> **Model:** `MealPlan`

---

### 9. `GET /api/meal-plans` — Get All Meal Plans

**What it does:**  
Fetches all meal plan entries for the default user. Each entry maps a specific meal slot (day + meal type) to a recipe. Used to populate the weekly meal planner grid.

| Field  | Value                    |
|--------|--------------------------|
| Method | `GET`                    |
| URL    | `/api/meal-plans`        |
| Auth   | None                     |

**Response (200 OK):**
```json
[
  {
    "_id": "...",
    "userId": "default_user",
    "day": "Monday",
    "meal": "Breakfast",
    "recipeTitle": "Keto Spinach Omelet",
    "recipeId": "scanned-1714900000000"
  },
  {
    "_id": "...",
    "userId": "default_user",
    "day": "Tuesday",
    "meal": "Lunch",
    "recipeTitle": "Creamy Vegan Pasta",
    "recipeId": null
  }
]
```

**Used by:** `MealPlan.jsx` page

---

### 10. `POST /api/meal-plans` — Add a Meal Plan Entry

**What it does:**  
Creates a new meal plan entry assigning a recipe to a specific day and meal slot (Breakfast, Lunch, or Dinner). Called when the user drags/assigns a recipe to a planner slot.

| Field        | Value                    |
|--------------|--------------------------|
| Method       | `POST`                   |
| URL          | `/api/meal-plans`        |
| Content-Type | `application/json`       |
| Auth         | None                     |

**Request Body:**
```json
{
  "day": "Wednesday",
  "meal": "Dinner",
  "recipeTitle": "Butter Chicken",
  "recipeId": "scanned-1714900000000"
}
```

**Field Descriptions:**

| Field         | Type   | Required | Description                                       |
|---------------|--------|----------|---------------------------------------------------|
| `day`         | String | ✅ Yes    | Day of the week (e.g., `"Monday"`, `"Tuesday"`)   |
| `meal`        | String | ✅ Yes    | Meal type: `"Breakfast"`, `"Lunch"`, `"Dinner"`   |
| `recipeTitle` | String | ✅ Yes    | Name of the recipe being planned                  |
| `recipeId`    | String | ❌ No     | Custom `id` of the recipe (for linking)           |

**Response (201 Created):**  
Returns the newly created MealPlan document.

**Used by:** `MealPlan.jsx` page

---

## 🤖 Recommendation API

> **Base Path:** `/api/recommendations`  
> **Route File:** `backend/routes/recommendationRoutes.js`

---

### 11. `POST /api/recommendations` — Get Personalized Recommendations

**What it does:**  
Returns 4 randomly shuffled recipe recommendations from a curated list of 20 pre-defined healthy recipes (covering Vegan, Keto, Vegetarian, Gluten-Free options). Each call returns a **different random set of 4** recommendations — giving the feel of personalized suggestions. Used on the Dashboard's recommendation section.

| Field        | Value                      |
|--------------|----------------------------|
| Method       | `POST`                     |
| URL          | `/api/recommendations`     |
| Content-Type | `application/json`         |
| Auth         | None                       |
| Body         | None required              |

**Response (200 OK):**
```json
[
  {
    "title": "Keto Avocado Salad",
    "description": "Fresh spinach, cherry tomatoes, and sliced avocado tossed in a vibrant lemon-herb olive oil dressing.",
    "calories": 320,
    "time": 10,
    "difficulty": "Easy",
    "tags": ["Keto", "Salad"]
  },
  {
    "title": "Creamy Vegan Pasta",
    "description": "A rich, creamy cashew-based sauce tossed with wild mushrooms and fresh spinach over rigatoni.",
    "calories": 450,
    "time": 25,
    "difficulty": "Easy",
    "tags": ["Vegan", "Pasta"]
  },
  ...
]
```

**Available Recipe Pool (20 total):**

| # | Recipe                        | Tags                         | Calories |
|---|-------------------------------|------------------------------|----------|
| 1 | Creamy Vegan Pasta            | Vegan, Pasta                 | 450      |
| 2 | Keto Avocado Salad            | Keto, Salad                  | 320      |
| 3 | Gluten-Free Almond Bread      | Gluten-Free, Bread           | 210      |
| 4 | Zesty Chickpea Salad          | Vegetarian, High-Fiber       | 380      |
| 5 | Keto Cauliflower Fried Rice   | Keto, Low-Carb               | 280      |
| 6 | Crispy Baked Tofu Bowls       | Vegan, Gluten-Free           | 410      |
| 7 | Classic Vegetable Biryani     | Vegetarian, Rice             | 510      |
| 8 | Protein Berry Smoothie        | Vegan, Breakfast             | 240      |
| 9 | Spicy Lentil Curry            | Vegan, Curry                 | 420      |
| 10| Gluten-Free Oat Pancakes      | Gluten-Free, Breakfast       | 350      |
| 11| Keto Spinach and Feta Omelet  | Keto, Breakfast              | 490      |
| 12| Grilled Sweet Potato Steaks   | Vegan, Gluten-Free           | 310      |
| 13| Mushroom Stroganoff           | Vegetarian, Gluten-Free      | 390      |
| 14| Mediterranean Quinoa Bowl     | Vegan, High-Protein          | 360      |
| 15| Spiced Pumpkin Soup           | Vegan, Soup                  | 210      |
| 16| Low-Carb Zucchini Noodles     | Keto, Low-Carb               | 190      |
| 17| Garlic Roasted Broccoli       | Vegan, Keto                  | 160      |
| 18| Chocolate Avocado Mousse      | Vegan, Dessert               | 270      |
| 19| Spicy Jackfruit Tacos         | Vegan, Tacos                 | 320      |
| 20| Warm Chia Pudding             | Vegan, Keto                  | 280      |

**Used by:** `Dashboard.jsx` (Recommendations section)

---

## 📊 Summary Table — All APIs at a Glance

| #  | Method   | Endpoint                         | What It Does                                       |
|----|----------|----------------------------------|----------------------------------------------------|
| 1  | `GET`    | `/`                              | Health check — server status                       |
| 2  | `GET`    | `/api/recipes`                   | Get all recipes (sorted newest first)              |
| 3  | `GET`    | `/api/recipes/:id`               | Get a single recipe by custom ID                  |
| 4  | `POST`   | `/api/scan`                      | Upload food image → AI identifies → save recipe   |
| 5  | `GET`    | `/api/user/profile`              | Get default user profile + diet preferences       |
| 6  | `POST`   | `/api/user/profile`              | Update user's dietary preferences                 |
| 7  | `GET`    | `/api/shopping-list`             | Get the user's shopping list                      |
| 8  | `POST`   | `/api/shopping-list`             | Add ingredients to shopping list (no duplicates)  |
| 9  | `DELETE` | `/api/shopping-list/:itemId`     | Remove one item from shopping list                |
| 10 | `GET`    | `/api/meal-plans`                | Get all weekly meal plan entries                  |
| 11 | `POST`   | `/api/meal-plans`                | Add a recipe to a day/meal slot in the planner    |
| 12 | `POST`   | `/api/recommendations`           | Get 4 random healthy recipe recommendations       |

---

## 🗄️ Database Models

### Recipe Schema
```
id (String, unique) | title | description | image | confidence
cuisine | calories | protein | fats | carbs | time | rating
reviews | difficulty | tags[] | servings
ingredients[]: { name, checked, substitutes[] }
instructions[]: { step, title, time, desc }
history: { story, image, rank }
trends[]: { country, flag, consumption }
```

### User Schema
```
id (String, unique) | name
dietaryPreferences: { vegan, vegetarian, keto, glutenFree }
dailyCaloriesGoal (default: 2000)
```

### ShoppingList Schema
```
userId (default: "default_user")
items[]: { name (required), checked (default: false) }
```

### MealPlan Schema
```
userId (default: "default_user")
day (required) | meal (required) | recipeTitle (required) | recipeId
```

---

## 🔑 Environment Variables (`.env`)

| Variable             | Value / Purpose                                              |
|----------------------|--------------------------------------------------------------|
| `PORT`               | `5000` — Server port                                         |
| `MONGO_URI`          | MongoDB Atlas connection string                              |
| `GEMINI_API_KEY`     | Google Gemini Vision API key (used in `/api/scan` Step 3)   |
| `IMGBB_API_KEY`      | `031f6c420634cd1572b116f59a52abea` — ImgBB image hosting key (used in `/api/scan` Step 1) |
| `PREDICTION_API_URL` | `https://snapcook-model.onrender.com/predict` — TFLite food classification model (used in `/api/scan` Step 2) |

**Full `.env` file:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/snapandcook
GEMINI_API_KEY=<your_gemini_key>
IMGBB_API_KEY=031f6c420634cd1572b116f59a52abea
PREDICTION_API_URL=https://snapcook-model.onrender.com/predict
```

---

## 🔗 External Services Used

| Service         | Used In       | Purpose                                          |
|-----------------|---------------|--------------------------------------------------|
| **ImgBB**       | `/api/scan`   | Hosts the uploaded image and returns a public URL|
| **TFLite Model**| `/api/scan`   | Food classification (custom Render deployment)   |
| **Google Gemini**| `/api/scan`  | Generates full recipe JSON from image analysis   |
| **MongoDB Atlas**| All routes   | Persists recipes, users, shopping lists, plans   |
