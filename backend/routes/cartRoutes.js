const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware"); // Make sure you have this middleware

// Helper to get cart by userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

// ---------------- POST /api/cart ----------------
// Add product to cart
router.post("/", async (req, res) => {
  try {
    const { productId, quantity, guestId, size, color, userId } =
      req.body || {};

    if (!productId)
      return res.status(400).json({ message: "Product ID required" });

    const qty = Number(quantity) || 1;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const price = Number(product.price) || 0;
    let cart = await getCart(userId, guestId);

    if (cart) {
      const index = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (index > -1) {
        cart.items[index].quantity += qty;
      } else {
        cart.items.push({
          productId: product._id,
          name: product.name,
          price,
          image: product.images[0]?.url || "",
          size,
          color,
          quantity: qty,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    }

    // Create new cart
    const newCart = await Cart.create({
      userId: userId || undefined,
      guestId: guestId || "guest_" + Date.now(),
      items: [
        {
          productId: product._id,
          name: product.name,
          price,
          image: product.images[0]?.url || "",
          size,
          color,
          quantity: qty,
        },
      ],
      totalPrice: price * qty,
    });

    return res.status(201).json(newCart);
  } catch (error) {
    console.error("CART ADD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- PUT /api/cart ----------------
// Update item quantity in cart
router.put("/", async (req, res) => {
  try {
    const { productId, quantity, guestId, size, color, userId } =
      req.body || {};
    const qty = Number(quantity);

    if (!productId)
      return res.status(400).json({ message: "Product ID required" });
    if (!qty && qty !== 0)
      return res.status(400).json({ message: "Quantity required" });

    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (index > -1) {
      if (qty > 0) {
        cart.items[index].quantity = qty;
      } else {
        cart.items.splice(index, 1);
      }

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("CART UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE /api/cart ----------------
// Remove item from cart
router.delete("/", async (req, res) => {
  try {
    const { productId, guestId, size, color, userId } = req.body || {};

    if (!productId)
      return res.status(400).json({ message: "Product ID required" });

    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Convert productId to string for comparison
    const productIdStr = productId.toString();

    const index = cart.items.findIndex((item) => {
      const itemProductId = item.productId?.toString() || item.productId;
      const sizeMatch =
        size === undefined ||
        size === null ||
        item.size === size ||
        item.size === String(size);
      const colorMatch =
        color === undefined ||
        color === null ||
        item.color === color ||
        item.color === String(color);

      return itemProductId === productIdStr && sizeMatch && colorMatch;
    });

    if (index > -1) {
      cart.items.splice(index, 1);
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      console.log(
        "Item not found - ProductId:",
        productIdStr,
        "Size:",
        size,
        "Color:",
        color
      );
      console.log(
        "Cart items:",
        cart.items.map((item) => ({
          productId: item.productId?.toString(),
          size: item.size,
          color: item.color,
        }))
      );
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("CART DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET /api/cart ----------------
// Get cart for a user or guest
router.get("/", async (req, res) => {
  try {
    const { guestId, userId } = req.query;
    const cart = await getCart(userId, guestId);

    if (cart) return res.status(200).json(cart);
    return res.status(404).json({ message: "Cart not found" });
  } catch (error) {
    console.error("CART GET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE /api/cart/clear ----------------
// Clear entire cart
router.delete("/clear", async (req, res) => {
  try {
    const { userId, guestId } = req.body;

    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("CART CLEAR ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- POST /api/cart/merge ----------------
// Merge guest cart into user cart on login
router.post("/merge", protect, async (req, res) => {
  try {
    const { guestId } = req.body;
    const userId = req.user._id;

    const guestCart = await Cart.findOne({ guestId });
    let userCart = await Cart.findOne({ userId });

    if (!guestCart) {
      if (userCart) return res.status(200).json(userCart);
      return res.status(404).json({ message: "Guest cart not found" });
    }

    if (!userCart) {
      // If user has no cart, just assign guest cart to user
      guestCart.userId = userId;
      guestCart.guestId = undefined;
      await guestCart.save();
      return res.status(200).json(guestCart);
    }

    // Merge guest items into user cart
    guestCart.items.forEach((guestItem) => {
      const index = userCart.items.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );
      if (index > -1) {
        userCart.items[index].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    userCart.totalPrice = userCart.items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );

    await userCart.save();
    await guestCart.deleteOne(); // delete guest cart after merge

    res.status(200).json(userCart);
  } catch (error) {
    console.error("CART MERGE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
