const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Checkout = require("../models/Checkout");
const { protect } = require("../middleware/authMiddleware");

// ================= CREATE CHECKOUT =================
router.post("/", protect, async (req, res) => {
  const { checkoutItems, paymentMethod, shippingAddress, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No checkout items" });
  }

  try {
    const checkout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      paymentMethod,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(checkout);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Checkout failed" });
  }
});

// ================= MARK AS PAID =================
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    checkout.isPaid = true;
    checkout.paymentStatus = "Paid";
    checkout.paidAt = Date.now();
    checkout.paymentDetails = req.body;

    const updated = await checkout.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Payment update failed" });
  }
});

// ================= FINALIZE CHECKOUT =================
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout)
      return res.status(404).json({ message: "Checkout not found" });

    if (!checkout.isPaid)
      return res.status(400).json({ message: "Payment not completed" });

    const order = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      paymentStatus: checkout.paymentStatus,
      paidAt: checkout.paidAt,
      paymentDetails: checkout.paymentDetails,
      status: "Processing",
    });

    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();
    await checkout.save();

    await Cart.findOneAndDelete({ userId: checkout.user });

    res.status(201).json(order);
  } catch (error) {
    console.error("FINALIZE ERROR:", error.message);
    res.status(500).json({ message: "Finalize failed", error: error.message });
  }
});
console.log("Order model:", Order);

module.exports = router;
