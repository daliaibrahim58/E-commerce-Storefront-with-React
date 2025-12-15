import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import EcoMarketLogo from "../assets/EcoMarketLogo.svg";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoCartOutline,
} from "react-icons/io5";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaPowerOff,
  FaChevronDown,
} from "react-icons/fa";
import { AuthContext } from "../App";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Typography,
  Dialog,
  DialogBody,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import { API_URLS } from "../api/config";

// Profile menu component
const ProfileMenu = ({ handleLogout, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

  const profileMenuItems = [];
  profileMenuItems.push({ label: userName || "Profile", icon: FaUserCircle });
  if ( role !== "admin") {
    profileMenuItems.push({
      label: "My Orders",
      icon: IoCartOutline,
      action: () => navigate("/my-orders"),
    });
  }
  profileMenuItems.push({
    label: "Sign Out",
    icon: FaPowerOff,
    action: handleLogout,
  });

  return (
    <Menu
      open={isMenuOpen}
      handler={setIsMenuOpen}
      placement="bottom-end"
      dismissOnClick={true}
    >
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt={userName}
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=80&q=80"
          />

          <FaChevronDown
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, action }, index) => (
          <MenuItem
            key={label}
            onClick={() => {
              setIsMenuOpen(false);
              if (action) action();
            }}
            className="flex items-center gap-2 rounded hover:bg-gray-100"
          >
            {React.createElement(icon, {
              className: `h-4 w-4 ${
                label === "Sign Out" ? "text-red-500" : ""
              }`,
            })}

            <Typography
              as="span"
              variant="small"
              className={`font-normal ${
                label === "Sign Out" ? "text-red-500" : ""
              }`}
            >
              {label}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

const Navbar = ({ cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userName, role, setAuth } = useContext(AuthContext);
  const [hasOrders, setHasOrders] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `hover:text-green-400 transition-colors duration-200 ${
      isActive ? "text-green-400" : "text-gray-800"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuth({ isLoggedIn: false, role: "", userName: "" });
    navigate("/login");
  };

  // Determine whether the logged-in (non-admin) user has any orders yet.
  useEffect(() => {
    let cancelled = false;
    const checkOrders = async () => {
      if (!isLoggedIn || role === "admin") {
        setHasOrders(false);
        return;
      }
      try {
        const res = await axios.get(API_URLS.ORDERS);
        const data = res.data;
        const orders = Array.isArray(data) ? data : data.orders || data.items || data.data || [];
        if (!cancelled) setHasOrders(Array.isArray(orders) ? orders.length > 0 : false);
      } catch (err) {
        // If any error (401/403) occurs, hide link
        if (!cancelled) setHasOrders(false);
      }
    };

    checkOrders();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, role]);
  // Search Popup State & Logic
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();

    if (location.pathname !== "/products") return;

    navigate(`/products?search=${searchValue}`);
    setOpenSearch(false);
  };

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  justify-between items-center h-20">
          {/* Logo */}
          <Link to="/">
            <img
              src={EcoMarketLogo}
              alt="EcoMarket Logo"
              className="w-40 lg:w-36 h-auto"
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex gap-7 text-gray-800 font-semibold text-md transition-colors duration-300 justify-center  flex-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {isLoggedIn && role === "admin" && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
            {isLoggedIn && role !== "admin" && hasOrders && (
              <NavLink to="/my-orders" className={navLinkClass}>
                My Orders
              </NavLink>
            )}
          </nav>

          {/* Right Icons / Auth */}
          <div className="flex items-center gap-5">
            <div className="p-2 rounded-md hover:bg-gray-300/30 transition-colors duration-200 cursor-pointer">
              {/* Search Icon */}
              <div
                className="p-2 rounded-md hover:bg-gray-300/30 transition-colors duration-200 cursor-pointer"
                onClick={() => setOpenSearch(true)}
              >
                <IoSearchOutline className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <div
              className="relative p-2 rounded-md hover:bg-gray-300/30 transition-colors duration-200 cursor-pointer"
              onClick={onCartClick}
            >
              <IoCartOutline className="w-5 h-5 text-gray-700" />

              {/* Badge */}
              {cartCount > 0 && (
                <div
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center 
                                    w-5 h-5 text-[10px] font-bold text-white bg-red-500 
                                    border-2 border-white rounded-full"
                >
                  {cartCount}
                </div>
              )}
            </div>
            {isLoggedIn ? (
              <ProfileMenu handleLogout={handleLogout} userName={userName} />
            ) : (
              <Link to="/login">
                <div className="p-2 rounded-md hover:bg-gray-300/30 transition-colors duration-200 cursor-pointer">
                  <IoPersonOutline className="w-5 h-5 text-gray-700" />
                </div>
              </Link>
            )}
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-2xl p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <nav className="lg:hidden  flex flex-col gap-4 px-6 py-4 text-gray-800 font-semibold text-lg ">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors duration-200"
            >
              Products
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="hover:text-green-400 transition-colors duration-200"
            >
              Contact
            </Link>
            {isLoggedIn && role === "admin" && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="hover:text-green-400 transition-colors duration-200"
              >
                Dashboard
              </Link>
            )}
              {isLoggedIn && role !== "admin" && hasOrders && (
                <Link
                  to="/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-green-400 transition-colors duration-200"
                >
                  My Orders
                </Link>
              )}
          </nav>
        )}
      </div>
      {/* Search Dialog */}
      <Dialog
        open={openSearch}
        handler={setOpenSearch}
        size="md"
        className="p-4"
      >
        <DialogBody className="space-y-5">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Search Products
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              label="Search for eco-friendly products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
              className="flex-1"
            />

            <Button
              type="submit"
              color={location.pathname === "/products" ? "green" : "gray"}
              disabled={location.pathname !== "/products"}
            >
              Search
            </Button>
          </form>

          {/* Not allowed message */}
          {location.pathname !== "/products" && (
            <p className="text-red-500 text-sm text-center">
              Searching is only available on the Products page.
            </p>
          )}

          {/* Popular Searches */}
          <div>
            <p className="text-gray-700 mb-3 font-medium">Popular searches:</p>

            <div className="flex flex-wrap gap-3">
              {["Bamboo", "Organic", "Zero Waste"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSearchValue(item);
                  }}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </header>
  );
};

export default Navbar;
