import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaShoppingBag,
} from "react-icons/fa";
import { API_URLS } from "../../api/config";

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
        // Debug: log token and axios default auth header to help diagnose 401s
        try {
          const token = localStorage.getItem("token");
          console.debug("Overview fetch - localStorage token:", token);
          console.debug(
            "Overview fetch - axios default Authorization:",
            axios.defaults.headers?.common?.Authorization
          );
        } catch (e) {
          console.debug("Overview fetch - unable to read token/header", e);
        }
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(API_URLS.USERS),
          axios.get(API_URLS.PRODUCTS),
          axios.get(API_URLS.ORDERS),
        ]);

        // Normalize responses to arrays (backend may return different shapes)
        const usersData = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.users ||
            usersRes.data?.items ||
            usersRes.data?.data ||
            [];

        const productsData = Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.products ||
            productsRes.data?.items ||
            productsRes.data?.data ||
            [];

        const ordersData = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : ordersRes.data?.orders ||
            ordersRes.data?.items ||
            ordersRes.data?.data ||
            [];

        // Calculate total ordered items (sum of quantities) from all orders
        let totalOrderedItems = 0;
        ordersData.forEach((order) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((it) => {
              const qty = it.quantity ?? it.qty ?? it.count ?? 1;
              totalOrderedItems += Number(qty) || 0;
            });
          }
        });

        setStats({
          users: usersData.length,
          products: productsData.length,
          orders: ordersData.length,
          orderedItems: totalOrderedItems,
        });
      } catch (error) {
        // Log more details for 401 debugging
        if (error?.response) {
          console.error(
            "Error fetching dashboard stats (response):",
            error.response.status,
            error.response.data
          );
        } else {
          console.error("Error fetching dashboard stats:", error);
        }
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h2>
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
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.products}
            </h3>
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
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.orderedItems}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
