import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import { toast } from "sonner";
import { fetchUserProfile } from "../../redux/slices/authSlice";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsChecking(true);

      // Check if user is logged in
      const storedToken = localStorage.getItem("userToken");
      const storedUserStr = localStorage.getItem("userInfo");

      if (!storedToken) {
        toast.error("Please login to access admin panel");
        navigate("/login");
        setIsChecking(false);
        return;
      }

      let currentUser = null;

      // Try to get user from Redux first
      if (user && user.role) {
        currentUser = user;
      }
      // If not in Redux, try localStorage
      else if (storedUserStr) {
        try {
          currentUser = JSON.parse(storedUserStr);
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
        }
      }

      // If still no user, fetch from API
      if (!currentUser && storedToken) {
        try {
          const fetchedUser = await dispatch(fetchUserProfile()).unwrap();
          currentUser = fetchedUser;
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          toast.error("Session expired. Please login again.");
          navigate("/login");
          setIsChecking(false);
          return;
        }
      }

      // Check admin role (case-insensitive)
      const userRole = currentUser?.role?.toLowerCase()?.trim();

      console.log("Admin Access Check:", {
        hasUser: !!currentUser,
        role: userRole,
        userObject: currentUser,
      });

      if (!userRole || userRole !== "admin") {
        toast.error(
          `Access denied. Admin privileges required. Current role: ${
            userRole || "none"
          }`
        );
        navigate("/");
        setIsChecking(false);
        return;
      }

      setIsChecking(false);
    };

    checkAdminAccess();
  }, [token, user, navigate, dispatch]);

  // Show loading while checking
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Get user from Redux or localStorage
  const currentUser =
    user ||
    (localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null);
  const userRole = currentUser?.role?.toLowerCase();

  // Don't render if not admin
  if (!token || userRole !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center px-4 z-40">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100 md:hidden"
        >
          <FaBars className="text-gray-700 text-lg" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        <div className="ml-auto text-sm text-gray-600">
          Welcome, {currentUser?.name || "Admin"}
        </div>
      </div>

      {/* Overlay (mobile only) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:static top-14 md:top-0 left-0
            h-[calc(100vh-3.5rem)] md:h-screen
            w-64 bg-gray-900 text-white z-40
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <AdminSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-6 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
