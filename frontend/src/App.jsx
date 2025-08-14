import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Salons from "./pages/Salons"
import Stylists from "./pages/Stylists"

function App() {
  
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/stylists" element={<Stylists />} />
      </Routes>
  );
}

export default App;
