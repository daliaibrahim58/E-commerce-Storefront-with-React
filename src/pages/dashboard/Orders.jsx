import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FaEye, FaTimes } from "react-icons/fa";
import { API_URLS } from "../../api/config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const API_URL = API_URLS.ORDERS;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = (order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const updatedOrder = { ...currentOrder, status: newStatus };
    setCurrentOrder(updatedOrder);
  };

  const handleSave = async () => {
    try {
      if (currentOrder.status === "Delivered") {
        // Reduce stock when order is delivered
        if (window.confirm("Setting order to Delivered will reduce stock. Continue?")) {
          // Check if this order was already delivered (to avoid reducing stock twice)
          const originalOrder = orders.find(o => o.id === currentOrder.id);
          if (originalOrder && originalOrder.status === "Delivered") {
            alert("This order is already marked as Delivered");
            return;
          }

          // Reduce stock for each item in the order
          const stockUpdatePromises = currentOrder.items?.map(async (item) => {
            try {
              const productResponse = await axios.get(`${API_URLS.PRODUCTS}/${item.id}`);
              const currentProduct = productResponse.data;
              const newStock = Math.max(0, (currentProduct.stock || 0) - item.quantity);
              
              await axios.put(`${API_URLS.PRODUCTS}/${item.id}`, {
                ...currentProduct,
                stock: newStock
              });
            } catch (error) {
              console.error(`Error reducing stock for product ${item.id}:`, error);
            }
          }) || [];

          await Promise.all(stockUpdatePromises);
          
          // Update order status
          await axios.put(`${API_URL}/${currentOrder.id}`, currentOrder);
          setOrders(orders.map(o => o.id === currentOrder.id ? currentOrder : o));
          setIsModalOpen(false);
          alert("Order marked as Delivered and stock reduced successfully");
        }
      } else if (currentOrder.status === "Cancelled") {
        // Check if order was delivered before cancelling
        const originalOrder = orders.find(o => o.id === currentOrder.id);
        const wasDelivered = originalOrder && originalOrder.status === "Delivered";
        
        const confirmMessage = wasDelivered 
          ? "This order was Delivered. Cancelling will restore stock and delete the order. Continue?"
          : "Cancelling this order will delete it. Continue?";
          
        if (window.confirm(confirmMessage)) {
          // Restore stock only if order was delivered
          if (wasDelivered) {
            const stockRestorePromises = currentOrder.items?.map(async (item) => {
              try {
                const productResponse = await axios.get(`${API_URLS.PRODUCTS}/${item.id}`);
                const currentProduct = productResponse.data;
                const restoredStock = (currentProduct.stock || 0) + item.quantity;
                
                await axios.put(`${API_URLS.PRODUCTS}/${item.id}`, {
                  ...currentProduct,
                  stock: restoredStock
                });
              } catch (error) {
                console.error(`Error restoring stock for product ${item.id}:`, error);
              }
            }) || [];

            await Promise.all(stockRestorePromises);
          }
          
          // Delete the order
          await axios.delete(`${API_URL}/${currentOrder.id}`);
          setOrders(orders.filter(o => o.id !== currentOrder.id));
          setIsModalOpen(false);
          
          const successMessage = wasDelivered 
            ? "Order cancelled, stock restored, and order deleted successfully"
            : "Order cancelled and deleted successfully";
          alert(successMessage);
        }
      } else {
        // Update order status for Pending
        await axios.put(`${API_URL}/${currentOrder.id}`, currentOrder);
        setOrders(orders.map(o => o.id === currentOrder.id ? currentOrder : o));
        setIsModalOpen(false);
        alert("Order updated successfully");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
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
              <th className="p-4 border-b">Order ID</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Date</th>
              <th className="p-4 border-b">Total</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b font-medium">{order.id}</td>
                <td className="p-4 border-b">{order.customer || "Guest"}</td>
                <td className="p-4 border-b">{order.date || new Date().toLocaleDateString()}</td>
                <td className="p-4 border-b">${(order.total || 0).toFixed(2)}</td>
                <td className="p-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status || "Pending"}
                  </span>
                </td>
                <td className="p-4 border-b text-right">
                  <button 
                    onClick={() => handleView(order)}
                    className="text-blue-500 hover:text-blue-700 p-1"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Order Details</h3>
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
                  <label className="block text-sm font-medium text-gray-700">Order ID</label>
                  <p className="mt-1 text-gray-900">{currentOrder.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-gray-900">{currentOrder.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="mt-1 text-gray-900">{currentOrder.customer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total</label>
                  <p className="mt-1 text-gray-900">${currentOrder.total}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={currentOrder.status}
                  onChange={handleStatusChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  {currentOrder.items && currentOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
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
                    currentOrder.status === "Delivered"
                      ? "bg-green-600 hover:bg-green-700"
                      : currentOrder.status === "Cancelled"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {currentOrder.status === "Delivered" ? "Deliver & Reduce Stock" : 
                   currentOrder.status === "Cancelled" ? "Cancel Order" : "Save Changes"}
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