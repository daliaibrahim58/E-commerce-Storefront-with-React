import { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaBoxOpen, FaClipboardList, FaShoppingBag } from "react-icons/fa";

const Overview = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    orderedItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/users"),
          axios.get("https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/items"),
          axios.get("https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/orders"),
        ]);

        // Calculate total ordered items from all orders
        let totalOrderedItems = 0;
        ordersRes.data.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            totalOrderedItems += order.items.length;
          }
        });

        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          orderedItems: totalOrderedItems,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.users}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <FaBoxOpen size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.products}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
            <FaClipboardList size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.orders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-full">
            <FaShoppingBag size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ordered Items</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.orderedItems}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

