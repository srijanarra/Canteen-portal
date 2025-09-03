const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');

// Buyer - Create a new order (placed by buyer)
router.post("/", async (req, res) => {
  try {
    const { buyerId, itemId, quantity, addons } = req.body;

    // Get item details to fetch price & vendor
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Calculate total price
    let totalPrice = item.price * quantity;
    if (addons && addons.length > 0) {
      addons.forEach((addon) => {
        totalPrice += addon.price;
      });
    }

    // Create new order
    const newOrder = new Order({
      buyerId,
      vendorId: item.vendorId, // ✅ taken from item model
      itemId,
      quantity,
      addons,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.json({ message: "Order placed successfully", order: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error placing order" });
  }
});

// Buyer - Get all orders for a buyer (needed for BuyerDashboard)
router.get("/buyer/:buyerId", async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.params.buyerId })
      .populate("itemId")
      .populate("vendorId");
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Vendor - Create a new order (placed by buyer)
router.post('/', async (req, res) => {
  try {
    const { buyerId, vendorId, itemId, quantity, addons, totalPrice } = req.body;

    const newOrder = new Order({
      buyerId,
      vendorId,
      itemId,
      quantity,
      addons,
      totalPrice
    });

    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vendor - Get all orders for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.params.vendorId })
      .populate('itemId')   // fetch item details
      .populate('buyerId'); // fetch buyer details if needed
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vendor - Update order status with max-10 rule
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If vendor tries to ACCEPT an order
    if (status === "ACCEPTED") {
      // Count how many orders vendor has in ACCEPTED or COOKING
      const activeOrders = await Order.countDocuments({
        vendorId: order.vendorId,
        status: { $in: ["ACCEPTED", "COOKING"] },
      });

      if (activeOrders >= 10) {
        return res.status(400).json({
          error: "You already have 10 active orders (ACCEPTED + COOKING).",
        });
      }
    }

    // Update order status
    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vendor - Get vendor stats
router.get("/vendor/:vendorId/stats", async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    const orders = await Order.find({ vendorId }).populate("itemId");

    // Count categories
    const placed = orders.filter((o) => o.status === "PLACED").length;
    const completed = orders.filter((o) => o.status === "COMPLETED").length;
    const pending = orders.filter((o) =>
      ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP"].includes(o.status)
    ).length;

    // Top 5 items
    const itemCounts = {};
    orders.forEach((o) => {
      if (o.status === "COMPLETED" && o.itemId) {
        itemCounts[o.itemId.name] =
          (itemCounts[o.itemId.name] || 0) + o.quantity;
      }
    });

    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({ placed, pending, completed, topItems });
  } catch (err) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});


module.exports = router;
