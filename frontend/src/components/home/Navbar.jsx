import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo-icon.png";
import Login from "../auth/Login";

const Navbar = () => {
  const menuItems = [
    { key: "Home", label: "Home" },
    { key: "AboutUs", label: "About Us" },
    { key: "Services", label: "Services" },
    { key: "Stylist", label: "Stylist" },
    { key: "Booking", label: "Booking" },
  ];

  const [showLogin, setShowLogin] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="bg-pink-500 text-white py-4 px-6 flex justify-between items-center shadow-lg sticky top-0 z-10">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" className="h-12 w-auto" />
        </Link>

        {/* Menu Items */}
        <ul className="flex space-x-6 text-lg font-semibold">
          {menuItems.map(({ key, label }) => (
            <li key={key}>
              <Link
                to={key === "Home" ? "/" : `#${key}`}
                className="text-white hover:text-gray-200 transition duration-200 relative"
                onClick={() => scrollToSection(key)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login Button */}
        <button
          className="bg-white text-pink-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
          onClick={() => setShowLogin(true)} 
        >
          Login
        </button>
      </nav>

      {/* Hiển thị Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
