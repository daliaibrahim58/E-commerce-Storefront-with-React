import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import EcoMarketLogo from "../assets/EcoMarketLogo.svg";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoCartOutline,
} from "react-icons/io5";
import { FaBars, FaTimes, FaUserCircle, FaPowerOff, FaChevronDown } from "react-icons/fa";
import { AuthContext } from "../App";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Typography,
} from "@material-tailwind/react";

// Profile menu component
const ProfileMenu = ({ handleLogout, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profileMenuItems = [
    { label: userName || "Profile", icon: FaUserCircle },
    { label: "Sign Out", icon: FaPowerOff, action: handleLogout },
  ];

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
              className: `h-4 w-4 ${label === "Sign Out" ? "text-red-500" : ""}`,
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

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex  justify-between items-center h-20">
          {/* Logo */}
          <Link to="/">
            <img src={EcoMarketLogo} alt="EcoMarket Logo" className="w-40 lg:w-36 h-auto" />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex gap-7 text-gray-800 font-semibold text-md transition-colors duration-300 justify-center  flex-1">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/details" className={navLinkClass}>Categories</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

            {isLoggedIn && role === "admin" && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink>
            )}
          </nav>

          {/* Right Icons / Auth */}
          <div className="flex items-center gap-5">
              <div className="p-2 rounded-md hover:bg-gray-300/30 transition-colors duration-200 cursor-pointer">
                <IoSearchOutline className="w-5 h-5 text-gray-700" />
              </div>
              <div className="relative p-2 rounded-md hover:bg-gray-300/30 transition-colors duration-200 cursor-pointer"
                  onClick={onCartClick}
                >
                  <IoCartOutline className="w-5 h-5 text-gray-700" />

                  {/* Badge */}
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 inline-flex items-center justify-center 
                                    w-5 h-5 text-[10px] font-bold text-white bg-red-500 
                                    border-2 border-white rounded-full">
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
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
          </div>

          
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <nav className="lg:hidden  flex flex-col gap-4 px-6 py-4 text-gray-800 font-semibold text-lg ">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-green-400 transition-colors duration-200">Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-green-400 transition-colors duration-200">Products</Link>
            <Link to="/details" onClick={() => setIsOpen(false)} className="hover:text-green-400 transition-colors duration-200">Categories</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-green-400 transition-colors duration-200">About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-green-400 transition-colors duration-200">Contact</Link>
            {isLoggedIn && role === "admin" && (
              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="hover:text-green-400 transition-colors duration-200">Dashboard</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
