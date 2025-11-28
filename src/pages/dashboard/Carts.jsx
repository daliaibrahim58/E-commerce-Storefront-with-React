import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FaEye, FaTimes } from "react-icons/fa";
import { API_URLS } from "../../api/config";

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCart, setCurrentCart] = useState(null);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      // Read from ORDERS API
      const res = await axios.get(API_URLS.ORDERS);
      setCarts(res.data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleView = (cart) => {
    setCurrentCart(cart);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const orderToDelete = carts.find(c => c.id === id);
        
        // If order was delivered, restore stock before deleting
        if (orderToDelete.status === "Delivered") {
          const stockRestorePromises = orderToDelete.items?.map(async (item) => {
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
        
        // Delete from ORDERS API
        await axios.delete(`${API_URLS.ORDERS}/${id}`);
        setCarts(carts.filter(c => c.id !== id));
        
        alert("Order deleted successfully" + 
              (orderToDelete.status === "Delivered" ? " and stock restored" : ""));
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      }
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
            {carts.map((cart) => (
              <tr key={cart.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b font-medium">{cart.id}</td>
                <td className="p-4 border-b">{cart.customer || "Guest"}</td>
                <td className="p-4 border-b">{cart.date || new Date().toLocaleDateString()}</td>
                <td className="p-4 border-b">${(cart.total || 0).toFixed(2)}</td>
                <td className="p-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      cart.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : cart.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : cart.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cart.status || "Pending"}
                  </span>
                </td>
                <td className="p-4 border-b text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleView(cart)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => handleDelete(cart.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && currentCart && (
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
                  <p className="mt-1 text-gray-900">{currentCart.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-gray-900">{currentCart.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="mt-1 text-gray-900">{currentCart.customer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total</label>
                  <p className="mt-1 text-gray-900">${currentCart.total}</p>
                </div>
              </div>

              {/* Address Section */}
              {currentCart.address && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                  <div className="bg-gray-50 rounded-md p-4 space-y-1">
                    <p className="text-sm">{currentCart.address.street}</p>
                    <p className="text-sm">{currentCart.address.city}, {currentCart.address.state} {currentCart.address.zip}</p>
                    <p className="text-sm">{currentCart.address.country}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  {currentCart.items && currentCart.items.map((item, index) => (
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carts;
