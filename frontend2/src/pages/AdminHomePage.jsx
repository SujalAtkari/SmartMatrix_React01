import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";
import { fetchAllProducts } from "../redux/slices/adminproductSlice";
import { fetchAllUsers } from "../redux/slices/adminSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.adminOrder);
  const { products } = useSelector((state) => state.adminProduct);
  const { users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllProducts());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Calculate stats
  const totalRevenue =
    orders?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;

  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalUsers = users?.length || 0;

  // Get recent orders (last 5)
  const recentOrders =
    orders
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5) || [];

  const stats = [
    {
      name: "Total Revenue",
      value: `$${(totalRevenue || 0).toFixed(2)}`,
      icon: "💰",
    },
    {
      name: "Total Orders",
      value: totalOrders.toString(),
      link: "/admin/orders",
      icon: "📦",
    },
    {
      name: "Total Products",
      value: totalProducts.toString(),
      link: "/admin/products",
      icon: "🛍️",
    },
    {
      name: "Total Users",
      value: totalUsers.toString(),
      link: "/admin/users",
      icon: "👥",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            <span className="text-4xl mb-2">{stat.icon}</span>
            <p className="text-gray-500 text-sm">{stat.name}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>

            {stat.link && (
              <Link
                to={stat.link}
                className="text-blue-600 mt-3 hover:underline text-sm"
              >
                View Details →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">#{order._id.slice(-8)}</td>
                    <td className="p-3">
                      {order.user?.name || order.user?.email || "N/A"}
                    </td>
                    <td className="p-3">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        order.isPaid
                          ? "text-green-600"
                          : order.status === "Cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"} -{" "}
                      {order.status || "Processing"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
