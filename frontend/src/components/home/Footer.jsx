import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Slogan */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-pink-500">HAIR BOOKING SALON</h2>
          <p className="text-gray-400 mt-2">
            Where beauty meets confidence.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex space-x-6 text-gray-300 text-sm">
          <a href="/" className="text-white hover:text-pink-500 transition duration-200">
            Home
          </a>
          <a href="#AboutUs" className="text-white hover:text-pink-500 transition duration-200">
            About Us
          </a>
          <a href="#Services" className="text-white hover:text-pink-500 transition duration-200">
            Services
          </a>
          <a href="#Booking" className="text-white hover:text-pink-500 transition duration-200">
            Booking
          </a>
        </div>

        {/* Social Media */}
        <div className="flex space-x-4 mt-6 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-pink-500 transition duration-200">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-500 transition duration-200">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-500 transition duration-200">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-pink-500 transition duration-200">
            <FaYoutube size={20} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} HairBooking Salon. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
