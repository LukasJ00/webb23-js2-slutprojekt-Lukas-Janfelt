import React, { useState } from "react";

function CartPage({ cart, setCart }) {
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [message, setMessage] = useState(""); // Lägg till en state för meddelanden

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000); // Dölj meddelandet efter 3 sekunder
  };
  
  const checkout = async () => {
    try {
      if (cart.length === 0) {
        showMessage("Kundvagnen är tom.");
        return;
      }

      // Skapa en kopia av kundvagnen
      const updatedCart = [...cart];

      // Kontrollera lagersaldot för varje produkt som läggs till i kundvagnen
      for (const product of updatedCart) {
        if (product.stock <= 0) {
          showMessage(`Produkten "${product.name}" är slut i lager.`);
          return; // Avbryt köpet om en produkt är slut
        }
        // Om det inte finns tillräckligt med lager, justera antalet i kundvagnen
        if (updatedCart.filter((p) => p.id === product.id).length > product.stock) {
          showMessage(`Det finns inte tillräckligt med "${product.name}" i lager.`);
          return; // Avbryt köpet om det inte finns tillräckligt med lager
        }
      }

      // Uppdatera lagersaldot
      for (const product of updatedCart) {
        const index = updatedCart.findIndex((p) => p.id === product.id);
        updatedCart[index].stock -= 1;
      }

      // Töm kundvagnen
      setCart([]);

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
        setPurchaseCompleted(true);
      } else {
        showMessage("Ett fel uppstod vid genomförandet av köpet.");
      }
    } catch (error) {
      console.error(error);
      showMessage("Ett fel uppstod.");
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItems = cart.reduce((acc, product) => {
    // Skapa en kopia av kundvagnsobjektet med ett attribut 'quantity'
    const cartItem = { ...product, quantity: 1 };

    // Kontrollera om produkten redan finns i 'acc'
    const existingProduct = acc.find((p) => p.id === cartItem.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      acc.push(cartItem);
    }

    return acc;
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="checkout">
      <h1>Kundvagn</h1>
      {purchaseCompleted ? (
        <p>Tack för ditt köp!</p>
      ) : (
        cart.length === 0 ? (
          <p>Kundvagnen är tom.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id}>
                <h2>
                  {item.name} {item.quantity} st
                </h2>
                <p>Pris: {item.price * item.quantity} kr</p>
              </div>
            ))}
            <p>Totalpris: {totalPrice} kr</p>
            <div>
              <button onClick={checkout}>Genomför köp</button>
              <button onClick={clearCart}>Töm kundvagnen</button>
            </div>
          </div>
        )
      )}
      {message && <p>{message}</p>} {/* Visa meddelandet om det finns */}
    </div>
  );
}

export default CartPage;