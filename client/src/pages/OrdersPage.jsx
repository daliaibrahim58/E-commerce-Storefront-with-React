import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_URLS } from "../api/config";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URLS.ORDERS);
      const data = res.data;
      const ordersArr = Array.isArray(data)
        ? data
        : data.orders || data.items || data.data || [];
      setOrders(ordersArr);
    } catch (err) {
      console.error("Error fetching user orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn]);

  // Redirect non-admin users who have no orders to home
  useEffect(() => {
    if (!loading && isLoggedIn && role !== "admin") {
      if (!orders || orders.length === 0) {
        navigate("/");
      }
    }
  }, [loading, isLoggedIn, role, orders, navigate]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(`${API_URLS.ORDERS}/${orderId}`);
      setOrders((prev) => prev.filter((o) => (o._id || o.id) !== orderId));
      alert("Order cancelled successfully");
    } catch (err) {
      console.error("Error cancelling order", err.response || err);
      alert(
        "Failed to cancel order: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (!isLoggedIn) {
    return <p>Please login to view your orders.</p>;
  }

  if (loading) return <p>Loading your orders...</p>;

  return (
    <div className="flex flex-col min-h-80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-4xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id || order.id} className="p-4 border rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">
                    Order #{order._id || order.id}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.createdAt || order.date).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{`$${(
                    order.total ||
                    order.totalAmount ||
                    0
                  ).toFixed(2)}`}</div>
                  <div className="text-xs mt-1">
                    Status:{" "}
                    <span className="font-semibold">{order.status}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-medium">Items</h4>
                <ul className="mt-2 space-y-2">
                  {(order.items || []).map((it, idx) => {
                    const imgSrc =
                      it.product?.image ||
                      it.image ||
                      "https://via.placeholder.com/80x80?text=No+Image";
                    const name = it.product?.name || it.name || "Product";
                    const category = it.product?.category || "";
                    const qty = it.quantity ?? it.qty ?? it.count ?? 1;
                    return (
                      <li
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={imgSrc}
                            alt={name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="text-sm">
                            <div className="font-medium">{name}</div>
                            {category && (
                              <div className="text-xs text-gray-500">
                                {category}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-sm">Qty: {qty}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                {order.status !== "cancelled" &&
                  order.status !== "delivered" && (
                    <button
                      onClick={() => handleCancel(order._id || order.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
