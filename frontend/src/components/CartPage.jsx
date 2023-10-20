import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function CartPage({ cart, setCart}) {
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate(); 

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000); 
  };
  
  const checkout = async () => {
    try {
      if (cart.length === 0) {
        showMessage("Kundvagnen är tom.");
        return;
      }

      const updatedCart = [...cart];

      for (const product of updatedCart) {
        if (product.stock <= 0) {
          showMessage(`Produkten "${product.name}" är slut i lager.`);
          return;
        }
        if (updatedCart.filter((p) => p.id === product.id).length > product.stock) {
          showMessage(`Det finns inte tillräckligt med "${product.name}" i lager.`);
          return; 
        }
      }

      for (const product of updatedCart) {
        const index = updatedCart.findIndex((p) => p.id === product.id);
        updatedCart[index].stock -= 1;
      }

      setCart([]);

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
    setTimeout(() => {
    navigate("/");
    }, 1000);
  };

  const cartItems = cart.reduce((acc, product) => {
    const cartItem = { ...product, quantity: 1 };
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
      {message && <p>{message}</p>} {}
    </div>
  );
}

export default CartPage;