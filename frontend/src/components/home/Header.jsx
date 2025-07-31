import React from "react";
import headerImage from "../../assets/salon.jpg";

const Header = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${headerImage})` }}
    >
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

      {/* Content */}
      <div className="relative text-center max-w-2xl px-6">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wide text-pink-500">
          Shine Bright
        </h2>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-pink-500">
          Reveal Your True Beauty
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Experience professional hair services with top stylists. Let your beauty shine the right way.
        </p>

        <button className="mt-6 px-6 py-3 bg-pink-500 rounded-full text-lg font-semibold hover:bg-pink-600 transition duration-300 shadow-lg">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Header;
