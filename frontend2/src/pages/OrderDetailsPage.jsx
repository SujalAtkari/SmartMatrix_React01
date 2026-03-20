import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderById } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-gray-500 mb-4">
            {error || "Order details could not be loaded"}
          </p>
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const orderTotal =
    orderDetails.orderItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) ||
    orderDetails.totalPrice ||
    0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <p className="text-gray-500">
            Order ID: <span className="font-medium">#{orderDetails._id}</span>
          </p>
          <p className="text-sm text-gray-500">
            Created At: {new Date(orderDetails.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="mb-2">
              <span className="font-semibold">Payment Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {orderDetails.isPaid ? "PAID" : "UNPAID"}
              </span>
            </p>

            <p>
              <span className="font-semibold">Delivery Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  orderDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {orderDetails.isDelivered
                  ? "DELIVERED"
                  : orderDetails.status || "PROCESSING"}
              </span>
            </p>
          </div>

          <div>
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {orderDetails.paymentMethod || "N/A"}
            </p>
            {orderDetails.paidAt && (
              <p>
                <span className="font-semibold">Paid At:</span>{" "}
                {new Date(orderDetails.paidAt).toLocaleString()}
              </p>
            )}
            {orderDetails.deliveredAt && (
              <p>
                <span className="font-semibold">Delivered At:</span>{" "}
                {new Date(orderDetails.deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        {orderDetails.shippingAddress && (
          <div className="mb-6 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              {orderDetails.shippingAddress.address},<br />
              {orderDetails.shippingAddress.city}
              {orderDetails.shippingAddress.postalCode &&
                `, ${orderDetails.shippingAddress.postalCode}`}
              <br />
              {orderDetails.shippingAddress.country}
            </p>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 border">Product</th>
                <th className="text-left p-3 border">Unit Price</th>
                <th className="text-left p-3 border">Quantity</th>
                <th className="text-left p-3 border">Total</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails.orderItems?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={item.image || "https://via.placeholder.com/64"}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline font-medium"
                      >
                        {item.name}
                      </Link>
                      {item.size && item.color && (
                        <p className="text-sm text-gray-500">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-3">${(item.price || 0).toFixed(2)}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 font-semibold">
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Total */}
        <div className="flex justify-end mt-6 text-xl font-bold border-t pt-4">
          <span>Total: ${(orderTotal || 0).toFixed(2)}</span>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            to="/my-orders"
            className="text-blue-500 hover:underline font-medium"
          >
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
