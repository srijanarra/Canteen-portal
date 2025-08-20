const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');

const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

const buyerRoutes = require('./routes/buyers');
app.use('/buyer', buyerRoutes);
const vendorRoutes = require('./routes/vendors');
app.use('/vendor', vendorRoutes);
const buyerAuthRoutes = require('./routes/buyer_auth');
app.use('/buyer_auth', buyerAuthRoutes);
const vendorAuthRoutes = require('./routes/vendor_auth');
app.use('/vendor_auth', vendorAuthRoutes);
const ItemRouter = require("./routes/items");
app.use("/item", ItemRouter);
const OrderRouter = require('./routes/orders');
app.use('/order', OrderRouter);



mongoose.connect(
  'mongodb+srv://canteen-user:srija@cluster0.i8r97cx.mongodb.net/canteen-portal?retryWrites=true&w=majority&appName=Cluster0',
)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
