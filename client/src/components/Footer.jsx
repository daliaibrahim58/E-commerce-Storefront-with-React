import React from "react";
import { Link } from "react-router-dom";
import EcoMarketLogoFooter from "../assets/EcoMarketLogoFooter.svg";
import { LuFacebook, LuTwitter, LuInstagram, LuMail } from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="bg-[#101828] text-gray-300 w-full shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-6">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-8">
          <Link to="/">
          <img
            src={EcoMarketLogoFooter}
            alt="EcoMarket Logo"
            width={150}
            height={50}
            className="object-contain"
          />
          </Link>
          <p className="text-base sm:text-lg max-w-lg">
            Your trusted source for sustainable, eco-friendly products. Join us
            in creating a better future for our planet, one purchase at a time.
          </p>
          <div className="flex gap-4 text-2xl sm:text-3xl text-gray-400">
            <a href="https://www.facebook.com" target="_blank" className="hover:text-white transition-colors" aria-label="Facebook"><LuFacebook /></a>
            <a href="https://twitter.com" target="_blank" className="hover:text-white transition-colors" aria-label="Twitter"><LuTwitter /></a>
            <a href="https://www.instagram.com" target="_blank" className="hover:text-white transition-colors" aria-label="Instagram"><LuInstagram /></a>
            <a href="mailto:email@example.com" target="_blank" className="hover:text-white transition-colors" aria-label="Email"><LuMail /></a>
          </div>
        </div>

        {/* Middle */}
        <div className="flex-1 sm:flex-[0.5] flex flex-col gap-4">
          <div className="text-white font-bold text-lg sm:text-xl">Quick Links</div>
          <div className="flex flex-col gap-2 text-sm sm:text-base">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/products" className="hover:text-white transition-colors">Products</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 sm:flex-[0.5] flex flex-col gap-4">
          <div className="text-white font-bold text-lg sm:text-xl">Customer Service</div>
          <div className="flex flex-col gap-2 text-sm sm:text-base">
            <Link  className="hover:text-white transition-colors cursor-text">Help Center</Link>
            <Link  className="hover:text-white transition-colors cursor-text">Shipping Info</Link>
            <Link  className="hover:text-white transition-colors cursor-text">Returns</Link>
            <Link  className="hover:text-white transition-colors cursor-text">Size Guide</Link>
            <Link  className="hover:text-white transition-colors cursor-text">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[0.25px] bg-gray-800 my-4"></div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 gap-2 sm:gap-4 py-4 text-sm sm:text-base">
        <p>© 2025 EcoMarket. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link  className="hover:text-white transition-colors cursor-text">Privacy Policy</Link>
          <Link  className="hover:text-white transition-colors cursor-text">Terms Of Service</Link>
          <Link  className="hover:text-white transition-colors cursor-text">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer