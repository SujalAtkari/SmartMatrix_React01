import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/slices/adminproductSlice";
import { toast } from "sonner";
import axiosInstance from "../../utils/axiosInstance";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: createLoading } = useSelector((state) => state.adminProduct);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collection: "",
    material: "",
    gender: "",
    isfeatured: false,
    isPublished: false,
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const response = await axiosInstance.post("/api/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages([
        ...images,
        { url: response.data.imageURL, altText: file.name },
      ]);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    if (selectedColors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      await dispatch(
        createProduct({
          ...formData,
          sizes: selectedSizes,
          colors: selectedColors,
          images: images,
          price: Number(formData.price),
          discountPrice: formData.discountPrice
            ? Number(formData.discountPrice)
            : undefined,
          countInStock: Number(formData.countInStock),
        })
      ).unwrap();

      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error || "Failed to create product");
    }
  };

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Brown",
    "Gray",
    "Pink",
    "Purple",
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Product</h2>
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Products
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Discount Price (Optional)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Stock Quantity *</label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              placeholder="e.g., Top Wear, Bottom Wear"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Brand *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Collection *</label>
            <input
              type="text"
              name="collection"
              value={formData.collection}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              placeholder="e.g., Business Casual, Sportswear"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="e.g., Cotton, Polyester"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="4"
            required
            placeholder="Enter product description..."
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Sizes *</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded border ${
                  selectedSizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {selectedSizes.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Please select at least one size
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Colors *</label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorToggle(color)}
                className={`px-4 py-2 rounded border ${
                  selectedColors.includes(color)
                    ? "border-2 border-black"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              >
                {color}
              </button>
            ))}
          </div>
          {selectedColors.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Please select at least one color
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Images *</label>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt={img.altText || `Image ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded"
          />
          {images.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Please upload at least one image
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isfeatured"
              checked={formData.isfeatured}
              onChange={handleChange}
              className="mr-2"
            />
            Featured Product
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="mr-2"
            />
            Published
          </label>
        </div>

        <button
          type="submit"
          disabled={createLoading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {createLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;
