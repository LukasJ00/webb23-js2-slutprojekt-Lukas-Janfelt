import React from "react";

function CartPage({ cart, setCart }) {
  // Beräkna totalpriset baserat på produkterna i kundvagnen
  const total = cart.reduce((acc, product) => acc + product.price, 0);

  // Genomför köpet
  const checkout = () => {
    // Uppdatera lagersaldot för varje produkt
    const updatedCart = [...cart];
    updatedCart.forEach((cartProduct) => {
      const productIndex = products.findIndex(
        (product) => product.id === cartProduct.id
      );
      if (productIndex !== -1) {
        products[productIndex].stock -= 1;
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