const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");
const Cart = require("./models/Cart");
const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    const sampleProducts = products.map((p) => ({
      ...p,
      user: admin._id,
    }));

    await Product.insertMany(sampleProducts);

    console.log("✅ Data Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Failed", error);
    process.exit(1);
  }
};

seedData();
