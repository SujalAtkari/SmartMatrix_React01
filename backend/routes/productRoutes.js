const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isfeatured,
      isPublished,
      rating,
      numReviews,
      tags,
      dimensions,
      weight,
    } = req.body;

    // Ensure gender is lowercase and valid
    const validGenders = ["male", "female", "unisex"];
    if (!validGenders.includes(gender?.toLowerCase())) {
      return res.status(400).json({ message: "Invalid gender value" });
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender: gender.toLowerCase(),
      images,
      isfeatured,
      isPublished,
      rating,
      numReviews,
      tags,
      dimensions,
      weight,
      user: req.user._id, // admin user
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("PRODUCT CREATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/products/:id
// @desc Update a product
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isfeatured,
      isPublished,
      tags,
      dimensions,
      weight,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields only if provided
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.countInStock = countInStock || product.countInStock;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.sizes = sizes || product.sizes;
    product.colors = colors || product.colors;
    product.collection = collection || product.collection;
    product.material = material || product.material;
    if (gender) {
      const validGenders = ["male", "female", "unisex"];
      if (!validGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({ message: "Invalid gender value" });
      }
      product.gender = gender.toLowerCase();
    }
    product.images = images || product.images;
    product.isfeatured =
      isfeatured !== undefined ? isfeatured : product.isfeatured;
    product.isPublished =
      isPublished !== undefined ? isPublished : product.isPublished;
    product.tags = tags || product.tags;
    product.dimensions = dimensions || product.dimensions;
    product.weight = weight || product.weight;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("PRODUCT UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("PRODUCT DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/products
// @desc Get all products with optional filters
// @access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};
    let sort = {};

    if (collection && collection.toLowerCase() !== "all") {
      query.collection = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: [color] };
    }
    if (gender) {
      query.gender = gender.toLowerCase();
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error("PRODUCTS FETCH ERROR:", error);
    res.status(500).send("Server error");
  }
});

//@route GET /api/products/best-seller
//@desc retrive the products with highest sales
//@access public
router.get("/best-seller", async (req, res) => {
  try {
    // Get featured products or products with highest rating as best sellers
    const products = await Product.find({ isfeatured: true })
      .sort({ rating: -1 })
      .limit(1);

    if (products && products.length > 0) {
      res.json(products[0]);
    } else {
      // Fallback: get any product
      const anyProduct = await Product.findOne({});
      if (anyProduct) {
        res.json(anyProduct);
      } else {
        res.status(404).json({ message: "No best seller found" });
      }
    }
  } catch (error) {
    console.error("BEST SELLER FETCH ERROR:", error);
    res.status(500).send("Server error");
  }
});

//@route GET /api/products/new-arrivals
//@desc retrive the most recently added products
//@access public
router.get("/new-arrivals", async (req, res) => {
  try {
    //fetch latest 8 products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error("NEW ARRIVALS FETCH ERROR:", error);
    res.status(500).send("Server error");
  }
});

// @route GET /api/products/:id
// @desc Get single product by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error);
    res.status(500).send("Server error");
  }
});

//@route GET/api/products/similar/:id
//@desc Retrive similar products based on the current product's gender and category
//@access public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: product._id }, // Exclude the current product
      gender: product.gender,
      category: product.category,
    }).limit(4); // Limit to 4 similar products
    res.json(similarProducts);
  } catch (error) {
    console.error("SIMILAR PRODUCTS FETCH ERROR:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
