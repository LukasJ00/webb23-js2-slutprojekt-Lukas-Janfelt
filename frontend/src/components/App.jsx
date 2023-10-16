import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import CartPage from './CartPage';
import ProductPage from './productPage'; // Använd stor bokstav i 'ProductPage'


function App() {
  const [cart, setCart] = useState([]);


  return (
    <Router>
      <div> {/* Du måste ha en omgivande div eller annat element som omsluter ditt innehåll */}
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
