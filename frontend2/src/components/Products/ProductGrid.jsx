import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products = [], loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="border p-4 rounded hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
            alt={product.name}
            className="w-full h-40 object-cover mb-2 rounded"
          />
          <h3 className="font-medium text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 font-semibold">
            ${(product.price || 0).toFixed(2)}
            {product.discountPrice && (
              <span className="text-gray-400 line-through ml-2 text-sm">
                ${product.discountPrice.toFixed(2)}
              </span>
            )}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
