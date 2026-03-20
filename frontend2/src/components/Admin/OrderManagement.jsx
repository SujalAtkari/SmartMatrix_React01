import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../redux/slices/adminOrderSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({
          orderId: id,
          status: newStatus,
          isDelivered: newStatus === "Delivered",
        })
      ).unwrap();
      toast.success("Order status updated successfully");
      // Refresh orders
      dispatch(fetchAllOrders());
    } catch (error) {
      toast.error(error || "Failed to update order status");
    }
  };

  const markAsDelivered = async (id) => {
    try {
      await dispatch(
        updateOrderStatus({
          orderId: id,
          status: "Delivered",
          isDelivered: true,
        })
      ).unwrap();
      toast.success("Order marked as delivered");
      dispatch(fetchAllOrders());
    } catch (error) {
      toast.error(error || "Failed to mark order as delivered");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await dispatch(deleteOrder(id)).unwrap();
        toast.success("Order deleted successfully");
        dispatch(fetchAllOrders());
      } catch (error) {
        toast.error(error || "Failed to delete order");
      }
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const getButtonConfig = (status) => {
    if (status === "Cancelled") {
      return {
        text: "Cancelled",
        className: "bg-red-500 cursor-not-allowed",
        disabled: true,
      };
    }

    if (status === "Delivered") {
      return {
        text: "Delivered",
        className: "bg-gray-400 cursor-not-allowed",
        disabled: true,
      };
    }

    return {
      text: "Mark as Delivered",
      className: "bg-green-500 hover:bg-green-600",
      disabled: false,
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      {orders && orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Total Price</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
                <th className="p-3 border">Delete</th>
              </tr>
            </thead>

            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => {
                  const button = getButtonConfig(order.status);

                  return (
                    <tr key={order._id} className="text-center">
                      <td className="p-3 border">#{order._id.slice(-8)}</td>
                      <td className="p-3 border">
                        {order.user?.name || order.user?.email || "N/A"}
                      </td>
                      <td className="p-3 border">
                        ${(order.totalPrice || 0).toFixed(2)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3 border">
                        <select
                          value={order.status || "Processing"}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="border px-2 py-1 rounded"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Action Button */}
                      <td className="p-3 border">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => markAsDelivered(order._id)}
                            disabled={button.disabled}
                            className={`px-3 py-1 rounded text-white text-sm ${button.className} disabled:opacity-50`}
                          >
                            {button.text}
                          </button>
                          <button
                            onClick={() => handleViewDetails(order._id)}
                            className="px-3 py-1 rounded text-white text-sm bg-blue-500 hover:bg-blue-600"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="px-3 py-1 rounded text-white text-sm bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
