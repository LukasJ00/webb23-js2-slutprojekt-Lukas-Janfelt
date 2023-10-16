import React from "react";

function CartPage({ cart, setCart }) {
  const total = cart.reduce((acc, product) => acc + product.price, 0);

  const checkout = async () => {
    try {
      // Hämta en array med alla produkt-ID:n från kundvagnen
      const productIds = cart.map((product) => product.id);

      // Gör en POST-förfrågan till servern för att uppdatera lagersaldot för alla produkter
      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }), // Skicka produkt-ID:n till servern
      });

      if (response.ok) {
        // Om uppdateringen lyckades, rensa kundvagnen
        setCart([]);
        alert("Köpet har genomförts!");
      } else {
        alert("Ett fel uppstod vid genomförandet av köpet.");
      }
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod.");
    }
  }

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="checkout">
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