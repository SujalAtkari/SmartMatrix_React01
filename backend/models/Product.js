const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    countInStock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    collection: { type: String, required: true },
    material: { type: String },
    gender: {
      type: String,
      enum: ["Male", "Female", "unisex"],
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String },
      },
    ],
    isfeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    dimensions: { height: Number, width: Number, length: Number },
    weight: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
