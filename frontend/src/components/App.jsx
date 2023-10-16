import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import CartPage from "./CartPage";
import ProductPage from "./productPage";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <div>
        <Navbar cartItemCount={cart.length} />
        <Routes>
          <Route path="/" element={<ProductPage cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;