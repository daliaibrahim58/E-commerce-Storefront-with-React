import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const OrderedItems = () => {
  const [orderedItems, setOrderedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const ORDERS_URL = "https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/orders";

  const fetchOrderedItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(ORDERS_URL);
      const orders = res.data;
      
      // Extract all items from all orders
      const allItems = [];
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            allItems.push({
              ...item,
              orderId: order.id,
              customer: order.customer,
              orderDate: order.date,
              orderStatus: order.status
            });
          });
        }
      });
      
      setOrderedItems(allItems);
    } catch (error) {
      console.error("Error fetching ordered items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderedItems();
  }, []);

  const handleDeleteItem = async (orderId) => {
    try {
      // Get the full order to check its status
      const orderToDelete = orderedItems.find(item => item.orderId === orderId);
      
      if (!orderToDelete) {
        alert("Order not found");
        return;
      }

      const orderStatus = orderToDelete.orderStatus;
      const wasDelivered = orderStatus === "Delivered";
      
      const confirmMessage = wasDelivered 
        ? "This order was Delivered. Deleting will restore stock and remove the order. Continue?"
        : "Are you sure you want to delete this order? All items in this order will be removed.";
        
      if (window.confirm(confirmMessage)) {
        // Get the complete order data to access all items
        const orderResponse = await axios.get(`${ORDERS_URL}/${orderId}`);
        const fullOrder = orderResponse.data;
        
        // Restore stock only if order was delivered
        if (wasDelivered) {
          const stockRestorePromises = fullOrder.items?.map(async (item) => {
            try {
              const productResponse = await axios.get(`https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/items/${item.id}`);
              const currentProduct = productResponse.data;
              const restoredStock = (currentProduct.stock || 0) + item.quantity;
              
              await axios.put(`https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/items/${item.id}`, {
                ...currentProduct,
                stock: restoredStock
              });
            } catch (error) {
              console.error(`Error restoring stock for product ${item.id}:`, error);
            }
          }) || [];

          await Promise.all(stockRestorePromises);
        }
        
        // Delete the entire order from backend
        await axios.delete(`${ORDERS_URL}/${orderId}`);
        
        // Remove all items from this order from the view
        setOrderedItems(orderedItems.filter(item => item.orderId !== orderId));
        
        const successMessage = wasDelivered 
          ? "Order deleted and stock restored successfully"
          : "Order deleted successfully";
        alert(successMessage);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Ordered Items</h2>
        <span className="text-sm text-gray-600">{orderedItems.length} items total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Image</th>
              <th className="p-4 border-b">Product</th>
              <th className="p-4 border-b">Quantity</th>
              <th className="p-4 border-b">Price</th>
              <th className="p-4 border-b">Total</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Order Date</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {orderedItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center text-gray-500">
                  No ordered items found
                </td>
              </tr>
            ) : (
              orderedItems.map((item, index) => (
                <tr key={`${item.orderId}-${item.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover border"
                    />
                  </td>
                  <td className="p-4 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </td>
                  <td className="p-4 border-b">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      x{item.quantity}
                    </span>
                  </td>
                  <td className="p-4 border-b">${item.price}</td>
                  <td className="p-4 border-b font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-4 border-b">{item.customer}</td>
                  <td className="p-4 border-b">{item.orderDate}</td>
                  <td className="p-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : item.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : item.orderStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 border-b text-right">
                    <button
                      onClick={() => handleDeleteItem(item.orderId)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove from list"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderedItems;
