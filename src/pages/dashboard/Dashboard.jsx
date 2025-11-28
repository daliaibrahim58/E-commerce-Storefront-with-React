import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../App";
import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaChartPie,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaShoppingCart,
} from "react-icons/fa";

const Dashboard = () => {
  const { setAuth, userName } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, role: "", userName: "" });
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Overview", icon: <FaChartPie /> },
    { path: "/admin/dashboard/users", label: "Users", icon: <FaUsers /> },
    { path: "/admin/dashboard/products", label: "Products", icon: <FaBoxOpen /> },
    { path: "/admin/dashboard/orders", label: "Orders", icon: <FaClipboardList /> },
    { path: "/admin/dashboard/ordered-items", label: "Ordered Items", icon: <FaShoppingBag /> },
    { path: "/admin/dashboard/carts", label: "Carts", icon: <FaShoppingCart /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
        `}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">Admin</span>Panel
          </h1>
          <button 
            className="md:hidden text-gray-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {userName ? userName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-blue-600"
          >
            <FaBars size={24} />
          </button>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
             <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600"
          >
            <FaSignOutAlt size={20}/>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;