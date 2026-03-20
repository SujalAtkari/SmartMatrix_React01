import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FaUser,
  FaBoxOpen,
  FaShoppingCart,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "sonner";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const links = [
    { name: "Dashboard", to: "/admin", icon: <FaHome /> },
    { name: "Users", to: "/admin/users", icon: <FaUser /> },
    { name: "Products", to: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders", to: "/admin/orders", icon: <FaShoppingCart /> },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6 w-64 md:w-64">
      {/* Brand */}
      <div className="mb-8 text-center">
        <Link to="/admin" className="text-3xl font-bold text-white">
          NextKart
        </Link>
        <h2 className="font-medium mt-2 text-gray-300 text-sm">
          Admin Dashboard
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-3 transition"
                : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-3 transition"
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 bg-red-600 hover:bg-red-700 py-3 px-4 rounded text-white transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
