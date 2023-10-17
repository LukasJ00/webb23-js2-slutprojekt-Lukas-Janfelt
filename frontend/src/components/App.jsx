import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import CartPage from "./CartPage";
import ProductPage from "./ProductPage";

function App() {
  const [cart, setCart] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  return (
    <Router>
      <div>
        <Navbar cartItemCount={cart.length} />
        <Routes>
          <Route
            path="/"
            element={<ProductPage cart={cart} setCart={setCart} searchWord={searchWord} />}
          />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;