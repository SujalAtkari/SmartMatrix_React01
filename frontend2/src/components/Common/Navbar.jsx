import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../redux/slices/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart({ userId: user._id }));
    } else if (guestId) {
      dispatch(fetchCart({ guestId }));
    }
  }, [dispatch, user, guestId]);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const cartItemCount =
    cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left-Logo */}
        <div>
          <Link to="/" className="text-2xl font-bold">
            NextKart
          </Link>
        </div>

        {/* Center-Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>

        {/* Right-Icons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="block bg-black px-2 rounded text-sm text-white"
          >
            Admin
          </Link>
          <Link to="./profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {/* FIXED: py=0.5 → py-0.5 */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* search */}
          <div className="overflow-hidden"></div>
          <SearchBar />

          {/* FIXED: onClick added */}

          <button onClick={toggleNavDrawer}>
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* mobile navigation */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="#"
              className="block py-2 text-gray-700 hover:text-black "
              onClick={toggleNavDrawer}
            >
              Men
            </Link>
            <Link
              to="#"
              className="block py-2 text-gray-700 hover:text-black "
              onClick={toggleNavDrawer}
            >
              Women
            </Link>
            <Link
              to="#"
              className="block py-2 text-gray-700 hover:text-black "
              onClick={toggleNavDrawer}
            >
              Top Wear
            </Link>
            <Link
              to="#"
              className="block py-2 text-gray-700 hover:text-black "
              onClick={toggleNavDrawer}
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
