import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PayPalButton from "./PayPalButton";
import {
  createCheckout,
  markCheckoutAsPaid,
  finalizeCheckout,
} from "../../redux/slices/checkOutSlice";
import { fetchCart } from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { checkoutData, loading } = useSelector((state) => state.checkout);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  // Redirect if not logged in and verify token
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (!token && !storedToken) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }

    // Verify token is still valid
    if (!token && storedToken) {
      // Token might be in storage but not in Redux, reload user
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        // Token exists, continue
        return;
      } else {
        toast.error("Session expired. Please login again");
        navigate("/login");
      }
    }
  }, [token, navigate]);

  // Load cart on mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart({ userId: user._id }));
    }
  }, [dispatch, user]);

  // Get checkout ID from Redux state
  useEffect(() => {
    if (checkoutData?._id) {
      setCheckoutId(checkoutData._id);
    }
  }, [checkoutData]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (!cart?.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.country ||
      !shippingAddress.postalCode
    ) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    try {
      const checkoutItems = cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      await dispatch(
        createCheckout({
          checkoutItems,
          paymentMethod: "PayPal",
          shippingAddress,
          totalPrice: cart.totalPrice || 0,
        })
      ).unwrap();

      toast.success("Checkout created. Proceed to payment.");
    } catch (error) {
      toast.error(error || "Failed to create checkout");
    }
  };

  const handlePaymentSuccess = async (details) => {
    if (!checkoutId) {
      toast.error("Checkout session not found");
      return;
    }

    // Verify token before proceeding
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Session expired. Please login again");
      navigate("/login");
      return;
    }

    try {
      // Mark checkout as paid
      await dispatch(
        markCheckoutAsPaid({
          checkoutId,
          paymentDetails: details,
        })
      ).unwrap();

      // Finalize checkout (create order)
      const order = await dispatch(finalizeCheckout(checkoutId)).unwrap();

      toast.success("Order placed successfully!");

      // Navigate to order confirmation with order ID
      navigate("/order-confirmation", {
        state: { orderId: order._id },
      });
    } catch (error) {
      const errorMessage = error || "Failed to complete order";
      toast.error(errorMessage);

      // If unauthorized, redirect to login
      if (
        errorMessage.includes("authorized") ||
        errorMessage.includes("token")
      ) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
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

  const totalPrice =
    cart.totalPrice ||
    cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Checkout</h2>

          <form onSubmit={handleCreateCheckout} className="space-y-6">
            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            {/* Delivery */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>

              <input
                type="text"
                placeholder="Address"
                required
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
                className="border rounded-lg p-3 w-full mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  className="border rounded-lg p-3"
                />

                <input
                  type="text"
                  placeholder="Postal Code"
                  required
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="border rounded-lg p-3"
                />
              </div>

              <input
                type="text"
                placeholder="Country"
                required
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="border rounded-lg p-3 w-full mt-4"
              />
            </div>

            {/* Payment Section */}
            {!checkoutId ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Checkout..." : "Continue to Payment"}
              </button>
            ) : (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Pay with PayPal</h3>
                <PayPalButton
                  amount={totalPrice.toFixed(2)}
                  onSuccess={handlePaymentSuccess}
                  onError={() => toast.error("Payment failed. Try again.")}
                />
              </div>
            )}
          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          {cart.items.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <img
                src={item.image || "https://via.placeholder.com/64"}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " | "}
                  {item.color && `Color: ${item.color}`}
                </p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">
                ${((item.price || 0) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
