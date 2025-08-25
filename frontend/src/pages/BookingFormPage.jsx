import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import BookingForm from "../components/booking/BookingForm";

const BookingFormPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/booking")}
              className="text-white hover:text-pink-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div>
              <h1 className="text-4xl font-bold mb-2">New Booking</h1>
              <p className="text-pink-100">
                Book your perfect salon experience
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <BookingForm />
      </div>

      <Footer />
    </div>
  );
};

export default BookingFormPage;
