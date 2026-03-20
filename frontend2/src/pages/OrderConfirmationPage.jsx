import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderById } from "../redux/slices/orderSlice";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector((state) => state.orders);
  const orderId =
    location.state?.orderId || location.search.split("orderId=")[1];

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [orderId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalAmount =
    orderDetails.orderItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) ||
    orderDetails.totalPrice ||
    0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">
            Thank you for your order 🎉
          </h1>
          <p className="text-gray-500 mt-2">
            Your payment was successful and your order is confirmed.
          </p>
        </div>

        {/* Order Info */}
        <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-4">
          <div>
            <h2 className="font-semibold text-lg">
              Order ID:{" "}
              <span className="text-gray-700">#{orderDetails._id}</span>
            </h2>
            <p className="text-sm text-gray-500">
              Order Date:{" "}
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        {orderDetails.shippingAddress && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              {orderDetails.shippingAddress.address},<br />
              {orderDetails.shippingAddress.city},{" "}
              {orderDetails.shippingAddress.postalCode}
              <br />
              {orderDetails.shippingAddress.country}
            </p>
          </div>
        )}

        {/* Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>

          {orderDetails.orderItems?.map((item, index) => (
            <div
              key={index}
              className="flex items-center border rounded-lg p-4 mb-4"
            >
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover mr-4"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                {item.color && item.size && (
                  <p className="text-sm text-gray-500">
                    Color: {item.color} | Size: {item.size}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-semibold">
                ${((item.price || 0) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between text-xl font-bold border-t pt-4">
          <span>Total Amount</span>
          <span>${(totalAmount || 0).toFixed(2)}</span>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-x-4">
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition mr-2"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
