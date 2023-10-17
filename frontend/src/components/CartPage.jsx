import React from "react";

function CartPage({ cart, setCart }) {
  const total = cart.reduce((acc, product) => acc + product.price, 0);

  const checkout = async () => {
    try {
      // Skapa en kopia av kundvagnen
      const updatedCart = [...cart];
  
      // Kontrollera lagersaldot för varje produkt som läggs till i kundvagnen
      for (const product of updatedCart) {
        if (product.stock <= 0) {
          alert(`Produkten "${product.name}" är slut i lager.`);
          return; // Avbryt köpet om en produkt är slut
        }
        // Om det inte finns tillräckligt med lager, justera antalet i kundvagnen
        if (updatedCart.filter((p) => p.id === product.id).length > product.stock) {
          alert(`Det finns inte tillräckligt med "${product.name}" i lager.`);
          return; // Avbryt köpet om det inte finns tillräckligt med lager
        }
      }
  
      // Uppdatera lagersaldot och kundvagnen
      for (const product of updatedCart) {
        const index = updatedCart.findIndex((p) => p.id === product.id);
        updatedCart[index].stock -= 1;
      }
      setCart(updatedCart);
  
      // Gör en POST-förfrågan till servern för att genomföra köpet
      const productIds = updatedCart.map((product) => product.id);
      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      });
  
      if (response.ok) {
        alert("Köpet har genomförts!");
      } else {
        alert("Ett fel uppstod vid genomförandet av köpet.");
      }
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod.");
    }
  };

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