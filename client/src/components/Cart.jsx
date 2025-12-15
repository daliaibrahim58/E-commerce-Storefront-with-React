import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { API_URLS } from "../api/config";

import { IoBagOutline, IoAdd, IoRemove, IoClose } from "react-icons/io5";

// Separator component
function MTSeparator() {
  return <div className="w-full h-px bg-gray-200 my-3" />;
}

// Image component with fallback
function MTImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? "/fallback.png" : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

// Drawer component
function MTDrawer({ open, onClose, title, children }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-50 
          transform transition-transform duration-300 
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {title}
          </h2>

          <button onClick={onClose}>
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-[calc(100%-64px)] overflow-auto">{children}</div>
      </div>
    </>
  );
}

const Cart = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  setCartItems,
}) => {
  const { userName, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    phoneNumber: "",
    zip: "",
    country: "",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    return (
      address.street &&
      address.city &&
      address.phoneNumber &&
      address.zip &&
      address.country
    );
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert("Please login to checkout");
      return;
    }

    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }

    if (!validateAddress()) {
      alert("Please fill in all address fields");
      return;
    }

    try {
      // helper: fetch product with retries for transient network/server errors
      const fetchProductWithRetries = async (productId, retries = 2) => {
        let attempt = 0;
        while (attempt <= retries) {
          try {
            return await axios.get(`${API_URLS.PRODUCTS}/${productId}`);
          } catch (err) {
            attempt += 1;
            if (attempt > retries) throw err;
            // small backoff
            await new Promise((r) => setTimeout(r, 300 * attempt));
          }
        }
      };

      // Validate stock for all items
      const stockValidation = await Promise.all(
        items.map(async (item, idx) => {
          const productId = item.id || item._id || item.productId;
          // helper: check for Mongo ObjectId (24 hex chars)
          const isObjectId = (id) =>
            typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
          if (!productId || !isObjectId(productId)) {
            // Mark invalid id to prevent server 500s
            return {
              valid: false,
              productName: item.name,
              error: true,
              invalidId: true,
            };
          }
          try {
            const productResponse = await fetchProductWithRetries(productId, 2);
            const currentProduct =
              productResponse.data.product || productResponse.data;
            const availableStock = currentProduct.stock || 0;

            if (item.quantity > availableStock) {
              return {
                valid: false,
                productName: item.name,
                requested: item.quantity,
                available: availableStock,
              };
            }
            return { valid: true };
          } catch (error) {
            console.error(
              `Error checking stock for product ${productId || "unknown"}:`,
              error.response || error
            );
            // Distinguish server response errors from network/unknown errors
            const isServerError = !!error.response;
            return {
              valid: false,
              productName: item.name,
              error: true,
              serverError: isServerError,
              status: error.response?.status,
              productId,
            };
          }
        })
      );

      // Check if any item failed validation
      const invalidItem = stockValidation.find((v) => !v.valid);
      if (invalidItem) {
        if (invalidItem.error) {
          alert(
            `Error checking stock for ${invalidItem.productName}. Please try again.`
          );
        } else {
          alert(
            `Cannot checkout: ${invalidItem.productName} has only ${invalidItem.available} items in stock, but you requested ${invalidItem.requested}.`
          );
        }
        return;
      }

      // Create order with items details (backend expects items as [{ productId, quantity }])
      const payloadItems = items.map((i) => ({
        productId: i.id || i._id || i.productId,
        quantity: i.quantity,
      }));
      const orderData = {
        customer: userName,
        items: payloadItems,
        total: total,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        address: address, // Include address in the payload
      };

      // Ensure token is included (axios interceptors attempt this, but add explicit header to be safe)
      const token = (() => {
        try {
          return localStorage.getItem("token");
        } catch {
          return null;
        }
      })();

      if (!token) {
        alert(
          "You must be logged in to place an order. Please login and try again."
        );
        return;
      }

      // Get stored user and ensure they have 'client' role required by backend
      let storedUser = null;
      try {
        const raw = localStorage.getItem("user");
        storedUser = raw ? JSON.parse(raw) : null;
      } catch (err) {
        console.warn("Error parsing stored user", err);
      }

      if (!storedUser || storedUser.role !== "client") {
        alert(
          "Only users with role 'client' can place orders. Please login with a client account."
        );
        console.debug(
          "Order blocked: token present?",
          !!token,
          "storedUser:",
          storedUser
        );
        return;
      }

      // Debug info to help diagnose 403s (remove in production)
      console.debug(
        "Placing order with token (truncated):",
        token ? `${token.slice(0, 10)}...` : null,
        "user:",
        storedUser
      );

      // Place the order
      await axios.post(API_URLS.ORDERS, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      setCartItems([]);
      setShowAddressForm(false);
      setAddress({ street: "", city: "", phoneNumber: "", zip: "", country: "" });
      onClose();
      // Navigate to My Orders so user can see their order
      navigate("/my-orders");
    } catch (error) {
      // Show backend message when available and give actionable guidance for 401/403
      const serverMsg =
        error.response?.data?.message || error.message || "Unknown error";
      console.error("Error placing order:", error.response || error);

      if (error.response?.status === 401) {
        alert("Not authenticated. Please login and try again.");
        return;
      }

      if (error.response?.status === 403) {
        alert(
          "Forbidden: your account does not have permission to create orders. Make sure you are logged in as a client."
        );
        return;
      }

      alert("Failed to place order: " + serverMsg);
    }
  };

  // Helper wrappers to handle navigation when cart becomes empty
  const handleRemoveItem = (productId) => {
    const willBeEmpty = items.length <= 1;
    onRemoveItem(productId);
    if (willBeEmpty) {
      onClose();
      navigate("/");
      setTimeout(() => window.location.reload(), 120);
    }
  };

  const handleUpdateQuantity = (productId, qty) => {
    const willBeRemoval = qty <= 0;
    const willBeEmpty = willBeRemoval && items.length <= 1;
    if (willBeRemoval) {
      onRemoveItem(productId);
      if (willBeEmpty) {
        onClose();
        navigate("/");
        setTimeout(() => window.location.reload(), 120);
      }
    } else {
      onUpdateQuantity(productId, qty);
    }
  };

  return (
    <MTDrawer
      open={isOpen}
      onClose={() => {
        setShowAddressForm(false);
        onClose();
      }}
      title={
        <>
          <IoBagOutline className="w-6 h-6" />
          {showAddressForm
            ? "Checkout - Shipping Address"
            : `Shopping Cart (${items.length})`}
        </>
      }
    >
      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-8">
          <IoBagOutline className="h-16 w-16 text-gray-300" />

          <Typography className="text-gray-500">Your cart is empty</Typography>

          <Button color="blue" onClick={onClose}>
            Continue Shopping
          </Button>
        </div>
      ) : showAddressForm ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main St"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="New York"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={address.phoneNumber}
                onChange={handleAddressChange}
                className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(+20) 123456789"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                name="zip"
                value={address.zip}
                onChange={handleAddressChange}
                className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="USA"
                required
              />
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <Button fullWidth color="green" onClick={handleCheckout}>
              Place Order
            </Button>
            <Button
              fullWidth
              variant="text"
              color="blue-gray"
              onClick={() => setShowAddressForm(false)}
            >
              Back to Cart
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* ITEMS */}
          <div className="space-y-4 py-2">
            {items.map((item, idx) => {
              const productId =
                item.id || item._id || item.productId || `idx-${idx}`;
              return (
                <div key={productId} className="flex gap-3">
                  <MTImage
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <Typography className="font-medium text-sm line-clamp-2">
                      {item.name}
                    </Typography>
                    <div className="flex justify-between">
                      <div>
                        <Typography className="text-gray-500 text-xs">
                          {item.category}
                        </Typography>

                        <Typography className="font-bold text-sm mt-1">
                          {`$${item.price}`}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <IconButton
                          variant="outlined"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(
                              productId,
                              Math.max(0, item.quantity - 1)
                            )
                          }
                        >
                          <IoRemove className="h-4 w-4" />
                        </IconButton>

                        <Typography className="text-sm w-6 text-center">
                          {item.quantity}
                        </Typography>

                        <IconButton
                          variant="outlined"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(productId, item.quantity + 1)
                          }
                        >
                          <IoAdd className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <IconButton
                    variant="text"
                    onClick={() => handleRemoveItem(productId)}
                  >
                    <IoClose className="w-5 h-5 text-gray-600" />
                  </IconButton>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="mt-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm space-y-2">
                <span>Subtotal</span>
                <span>{`$${subtotal.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{`$${tax.toFixed(2)}`}</span>
              </div>

              <MTSeparator />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{`$${total.toFixed(2)}`}</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="space-y-2 mt-4">
              <Button fullWidth color="green" onClick={handleCheckout}>
                Checkout
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="blue"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </>
      )}
    </MTDrawer>
  );
};

export default Cart;
