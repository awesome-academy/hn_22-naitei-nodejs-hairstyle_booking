import React from "react";

const BookingIntro = () => {
  return (
    <section id="Booking" className="py-16 px-6 bg-pink-50 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-pink-500 mb-4">
          Book Your Appointment
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Choose your salon, stylist, service, and time slot — all in just a few simple steps. Fast, convenient, and tailored just for you.
        </p>
        <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-semibold transition duration-300 shadow-md">
          Book Now
        </button>
      </div>
    </section>
  );
};

export default BookingIntro;
