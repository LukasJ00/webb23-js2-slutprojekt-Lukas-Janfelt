import React, { useState, useEffect } from "react";


function CartPage({ cart = [], setCart, products }) {
    // Beräkna totalpriset baserat på produkterna i kundvagnen
    const total = cart.reduce((acc, product) => acc + product.price, 0);


  // Genomför köpet
  const checkout = () => {
    // Uppdatera lagersaldot för varje produkt
    const updatedProducts = [...products];
    cart.forEach((cartProduct) => {
      const productIndex = updatedProducts.findIndex(
        (product) => product.id === cartProduct.id
      );
      if (productIndex !== -1) {
        updatedProducts[productIndex].stock -= 1;
      }
    });


    // Uppdatera lagersaldot i state
    setCart([]);


    // Visa meddelande om att köpet har genomförts
    alert("Köpet har genomförts!");
  };


  // Töm kundvagnen
  const clearCart = () => {
    setCart([]);
  };


  return (
    <div>
      <h1>Kundvagn</h1>
      {cart.length === 0 ? (
        <p>Kundvagnen är tom.</p>
      ) : (
        <div>
          {cart.map((product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>
              <p>Pris: {product.price} kr</p>
            </div>
          ))}
          <p>Totalpris: {total} kr</p>
          <button onClick={checkout}>Genomför köp</button>
          <button onClick={clearCart}>Töm kundvagnen</button>
        </div>
      )}
    </div>
  );
}


export default CartPage;
