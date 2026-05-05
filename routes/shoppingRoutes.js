import express from "express";
import { ShoppingList } from "../models/ShoppingList.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let list = await ShoppingList.findOne({ userId: "default_user" });
    if (!list) {
      list = await ShoppingList.create({ userId: "default_user", items: [] });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { items } = req.body;
    let list = await ShoppingList.findOne({ userId: "default_user" });
    if (!list) {
      list = await ShoppingList.create({ userId: "default_user", items: [] });
    }

    items.forEach(itemName => {
      const exists = list.items.some(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (!exists) {
        list.items.push({ name: itemName, checked: false });
      }
    });

    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.delete("/:itemId", async (req, res) => {
  try {
    let list = await ShoppingList.findOne({ userId: "default_user" });
    if (list) {
      list.items = list.items.filter(item => item._id.toString() !== req.params.itemId);
      await list.save();
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
