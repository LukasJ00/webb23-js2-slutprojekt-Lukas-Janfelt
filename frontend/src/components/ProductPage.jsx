import React, { useState, useEffect } from "react";

function ProductPage({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    // Hämta produkter från din backend när komponenten mountas
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:3000/product"); // Anpassa URL:en för din API
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setStatus("ok");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  const addToCart = (product) => {
    if (product.stock > 0) {
      // Uppdatera kundvagnen
      setCart([...cart, product]);

      // Uppdatera lagersaldot i din products-lista
      const updatedProducts = [...products];
      const productIndex = updatedProducts.findIndex((p) => p.id === product.id);
      if (productIndex !== -1) {
        updatedProducts[productIndex].stock -= 1;
        setProducts(updatedProducts);
      }
    }
  }

  return (
    <div>
      <h1>Produktsida</h1>
      {status === "loading" && <p>Laddar produkter...</p>}
      {status === "error" && <p>Ett fel uppstod vid hämtningen av produkter.</p>}

      {status === "ok" && (
        <div className="product-card-container">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.name}</h2>
              <img src={product.image} alt={product.name} />
              <p>Pris: {product.price} kr</p>
              <p>Lagersaldo: {product.stock}</p>
              {product.stock > 0 ? (
                <button onClick={() => addToCart(product)}>Lägg till i kundvagnen</button>
              ) : (
                <p>Slut i lager</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;