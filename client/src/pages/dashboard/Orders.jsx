import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaTimes } from "react-icons/fa";
import { API_URLS } from "../../api/config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderNumber, setOrderNumber] = useState(1);

  const API_URL = API_URLS.ORDERS;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Normalize response: backend returns { orders: [...] }
      const data = res.data;
      const ordersArray = Array.isArray(data)
        ? data
        : data.orders || data.items || data.data || [];
      setOrders(ordersArray);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = (order, index) => {
    setCurrentOrder(order);
    setOrderNumber(index + 1);
    setIsModalOpen(true);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const updatedOrder = { ...currentOrder, status: newStatus };
    setCurrentOrder(updatedOrder);
  };

  const handleSave = async () => {
    try {
      const orderId = currentOrder._id || currentOrder.id;
      const originalOrder = orders.find((o) => (o._id || o.id) === orderId);

      if (currentOrder.status === "pending") {
        // Reduce stock when order status is set to Pending
        if (
          window.confirm(
            "Setting order to Pending will reduce stock. Continue?"
          )
        ) {
          // If stock was already reserved server-side or the order was previously delivered,
          // skip the manual client-side decrement and let the server-side status update handle it.
          if (
            originalOrder &&
            (originalOrder.stockReserved ||
              originalOrder.status === "delivered")
          ) {
            try {
              await updateOrderStatus(orderId, { status: currentOrder.status });
              setOrders(
                orders.map((o) =>
                  (o._id || o.id) === orderId
                    ? { ...o, status: currentOrder.status }
                    : o
                )
              );
              setIsModalOpen(false);
              alert(
                "Order set to Pending (server-side reservation already present)"
              );
            } catch (err) {
              console.error("Error updating order status:", err);
              alert(
                "Failed to update order: " +
                  (err.response?.data?.message || err.message)
              );
            }
            return;
          }

          // Check if stock was already reduced
          if (originalOrder && originalOrder.status === "pending") {
            alert("This order is already Pending. Stock already reduced.");
            return;
          }

          // Reduce stock for each item in the order
          const stockUpdatePromises =
            (getOrderItems(currentOrder) || []).map(async (item) => {
              try {
                const productId =
                  item.product?._id ||
                  item.product ||
                  item.productId ||
                  item.id ||
                  item._id;
                const productResponse = await axios.get(
                  `${API_URLS.PRODUCTS}/${productId}`
                );
                const currentProduct =
                  productResponse.data.product || productResponse.data;
                const newStock = Math.max(
                  0,
                  (currentProduct.stock || 0) - item.quantity
                );

                await axios.put(`${API_URLS.PRODUCTS}/${productId}`, {
                  ...currentProduct,
                  stock: newStock,
                });
              } catch (error) {
                console.error(`Error reducing stock for product:`, error);
              }
            }) || [];

          await Promise.all(stockUpdatePromises);

          // Update order status (use helper that falls back PUT -> PATCH if necessary)
          try {
            await updateOrderStatus(orderId, { status: currentOrder.status });
            setOrders(
              orders.map((o) =>
                (o._id || o.id) === orderId
                  ? { ...o, status: currentOrder.status }
                  : o
              )
            );
          } catch (err) {
            // If server reports insufficient stock, show actionable message
            const serverMsg =
              err.response?.data?.message ||
              err.message ||
              "Failed to update order";
            if (
              err.response?.status === 400 &&
              /Insufficient stock/i.test(serverMsg)
            ) {
              const go = window.confirm(
                serverMsg +
                  "\n\nWould you like to open Products admin to restock or edit the order?"
              );
              if (go) {
                // Navigate to admin products page so admin can restock
                window.location.href = "/admin/dashboard/products";
                return;
              }
              // otherwise keep modal open for manual action
              return;
            }
            throw err;
          }
          setIsModalOpen(false);
          alert("Order set to Pending and stock reduced successfully");
        }
      } else if (currentOrder.status === "cancelled") {
        // Restore stock (if needed) and delete order
        const wasPending = originalOrder && originalOrder.status === "pending";

        const confirmMessage = wasPending
          ? "This order was Pending. Cancelling will restore stock and delete the order. Continue?"
          : "Cancelling this order will delete it. Continue?";

        if (window.confirm(confirmMessage)) {
          // Call DELETE /api/orders/:id to remove the order and restore stock server-side
          try {
            await axios.delete(`${API_URL}/${orderId}`);
            setOrders(orders.filter((o) => (o._id || o.id) !== orderId));
            setIsModalOpen(false);
            alert("Order deleted successfully");
          } catch (err) {
            console.error("Error deleting order:", err.response || err);
            alert(
              "Failed to delete order: " +
                (err.response?.data?.message || err.message)
            );
          }
        }
      } else {
        // Update order status for other statuses (delivered, etc.)
        await updateOrderStatus(orderId, { status: currentOrder.status });
        setOrders(
          orders.map((o) =>
            (o._id || o.id) === orderId
              ? { ...o, status: currentOrder.status }
              : o
          )
        );
        setIsModalOpen(false);
        alert("Order updated successfully");
      }
    } catch (error) {
      console.error(
        "Error updating order:",
        error.response?.data || error.message || error
      );
      alert(
        "Failed to update order: " +
          (error.response?.data?.message || error.message || "See console")
      );
    }
  };

  // Helper: Try PUT then PATCH if backend doesn't support PUT for updating orders
  const updateOrderStatus = async (orderId, payload) => {
    // Backend defines status update route as PUT /api/orders/:id/status
    const statusUrl = `${API_URL}/${orderId}/status`;
    try {
      return await axios.put(statusUrl, payload);
    } catch (err) {
      // If PUT returns 404 try PATCH on the same path as a last resort
      if (err.response && err.response.status === 404) {
        try {
          return await axios.patch(statusUrl, payload);
        } catch (patchErr) {
          throw patchErr;
        }
      }
      throw err;
    }
  };

  // Helper: normalize order items from different backend shapes
  const getOrderItems = (order) => {
    if (!order) return [];
    // Common shapes: order.items, order.orderItems, order.cart?.items
    if (Array.isArray(order.items) && order.items.length) return order.items;
    if (Array.isArray(order.orderItems) && order.orderItems.length)
      return order.orderItems;
    if (
      order.cart &&
      Array.isArray(order.cart.items) &&
      order.cart.items.length
    )
      return order.cart.items;
    // fallback: try order.products or order.itemsMap
    if (Array.isArray(order.products)) return order.products;
    return [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Order #</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Date</th>
              <th className="p-4 border-b">Total</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {orders.map((order, index) => (
              <tr
                key={order._id || order.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 border-b font-medium">#{index + 1}</td>
                <td className="p-4 border-b">
                  {order.customer || order.user?.name || "Guest"}
                </td>
                <td className="p-4 border-b">
                  {order.date ||
                    new Date(
                      order.createdAt || Date.now()
                    ).toLocaleDateString()}
                </td>
                <td className="p-4 border-b">
                  ${(order.total || order.totalAmount || 0).toFixed(2)}
                </td>
                <td className="p-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status || "pending"}
                  </span>
                </td>
                <td className="p-4 border-b text-right">
                  <button
                    onClick={() => handleView(order, index)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Order #{orderNumber} Details
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order Number
                  </label>
                  <p className="mt-1 text-gray-900">#{orderNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <p className="mt-1 text-gray-900">
                    {currentOrder.date ||
                      new Date(
                        currentOrder.createdAt || Date.now()
                      ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer
                  </label>
                  <p className="mt-1 text-gray-900">
                    {currentOrder.customer ||
                      currentOrder.user?.name ||
                      "Guest"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total
                  </label>
                  <p className="mt-1 text-gray-900">
                    $
                    {(
                      currentOrder.total ||
                      currentOrder.totalAmount ||
                      0
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={currentOrder.status}
                  onChange={handleStatusChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Shipping Address */}
              {currentOrder.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </label>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-900">
                      {currentOrder.address.street || "-"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {currentOrder.address.country || ""},{" "}
                      {currentOrder.address.city || ""},{" "}
                      {currentOrder.address.zip || ""}
                    </p>
                    <p className="text-sm text-gray-700">
                      Phone:
                      {currentOrder.address.phoneNumber || ""}{" "}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items
                </label>
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  {getOrderItems(currentOrder).map((item, index) => {
                    const name =
                      item.name ||
                      item.product?.name ||
                      item.productName ||
                      "Product";
                    const qty = item.quantity || item.qty || item.count || 1;
                    const imageSrc =
                      item.image || item.product?.image || item.productImage;
                    const unitPrice =
                      item.price ?? item.unitPrice ?? item.product?.price ?? 0;
                    const lineTotal = unitPrice * qty;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-2 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          {imageSrc && (
                            <img
                              src={imageSrc}
                              alt={name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">{name}</p>
                            <p className="text-xs text-gray-500">
                              Quantity: {qty}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          ${lineTotal.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 rounded ${
                    currentOrder.status === "pending"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : currentOrder.status === "delivered"
                      ? "bg-green-600 hover:bg-green-700"
                      : currentOrder.status === "cancelled"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {currentOrder.status === "pending"
                    ? "Set Pending & Reduce Stock"
                    : currentOrder.status === "cancelled"
                    ? "Cancel Order"
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
