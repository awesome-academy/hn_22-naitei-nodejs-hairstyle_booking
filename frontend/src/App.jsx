import React from "react";
import Navbar from "./components/home/Navbar";
import Header from "./components/home/Header";
import AboutUs from "./components/home/AboutUs";
import Services from "./components/home/Services";
import StylistList from "./components/home/StylistList";
import BookingIntro from "./components/home/BookingIntro";
import Footer from "./components/home/Footer";

function App() {
  
  return (
    <>
      <Navbar />
      <Header />
      <AboutUs />
      <Services />
      <StylistList />
      <BookingIntro />
      <Footer />
    </>
  );
}

export default App;
