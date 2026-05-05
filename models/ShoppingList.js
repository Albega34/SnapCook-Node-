import mongoose from "mongoose";

const shoppingListItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

const shoppingListSchema = new mongoose.Schema({
  userId: { type: String, default: "default_user" },
  items: [shoppingListItemSchema]
}, { timestamps: true });

export const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);
