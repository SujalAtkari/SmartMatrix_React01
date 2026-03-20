import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin3Line } from "react-icons/ri";
import {
  fetchCart,
  updateCartQty,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const CartContents = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart({ userId: user._id }));
    } else if (guestId) {
      dispatch(fetchCart({ guestId }));
    }
  }, [dispatch, user, guestId]);

  const handleQuantityChange = async (productId, size, color, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId, size, color);
      return;
    }

    try {
      await dispatch(
        updateCartQty({
          productId,
          quantity: newQuantity,
          userId: user?._id,
          guestId: user?._id ? undefined : guestId,
        })
      ).unwrap();
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId, size, color) => {
    try {
      // Convert productId to string if it's an object
      const productIdStr =
        typeof productId === "object" ? productId.toString() : productId;

      await dispatch(
        removeFromCart({
          productId: productIdStr,
          size: size || undefined,
          color: color || undefined,
          userId: user?._id,
          guestId: user?._id ? undefined : guestId,
        })
      ).unwrap();

      // Refetch cart to update UI
      if (user?._id) {
        await dispatch(fetchCart({ userId: user._id }));
      } else if (guestId) {
        await dispatch(fetchCart({ guestId }));
      }

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error(error?.message || error || "Failed to remove item");
    }
  };

  if (loading) {
    return <p className="text-center py-4">Loading cart...</p>;
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div>
      {cart.items.map((item, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.name}
              className="w-20 h-24 object-cover rounded mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.size && `Size: ${item.size}`}
                {item.size && item.color && " | "}
                {item.color && `Color: ${item.color}`}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.productId,
                      item.size,
                      item.color,
                      (item.quantity || 1) - 1
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                >
                  -
                </button>
                <span className="mx-4 text-lg font-medium">
                  {item.quantity || 1}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.productId,
                      item.size,
                      item.color,
                      (item.quantity || 1) + 1
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold">
              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
            <button
              onClick={() =>
                handleRemoveItem(item.productId, item.size, item.color)
              }
              className="mt-2"
            >
              <RiDeleteBin3Line className="h-6 w-6 text-red-600 hover:text-red-800" />
            </button>
          </div>
        </div>
      ))}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${(cart.totalPrice || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartContents;
