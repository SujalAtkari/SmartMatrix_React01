import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CartContents from "../Cart/CartContents"; // ✅ default import

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate(); // ✅ correct hook

  const handleCheckout = () => {
    toggleCartDrawer(); // Close the drawer first
    navigate("/checkout"); // ✅ correct navigation
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/4 md:w-2/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Cart contents */}
      <div className="grow overflow-y-auto px-4">
        <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
        <CartContents />
      </div>

      {/* Checkout */}
      <div className="p-4 bg-white sticky bottom-0">
        <button
          onClick={handleCheckout}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Checkout
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Shipping, taxes and discount codes calculated at checkout.
        </p>
      </div>
    </div>
  );
};

export default CartDrawer;
