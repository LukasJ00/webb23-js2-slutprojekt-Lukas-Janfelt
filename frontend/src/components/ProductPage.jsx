import React, { useState, useEffect } from "react";
import SearchForm from "./SearchForm";
import LatestSearches from "./LatestSearches";

function ProductPage({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [latestSearches, setLatestSearches] = useState([]);

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:3000/product");
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const addToCart = (product) => {
    if (product.stock > 0) {
      setCart([...cart, product]);
    }
  };

  const handleSearchTerm = (term) => {
    if (term && !latestSearches.includes(term)) {
      const updatedSearches = [term, ...latestSearches.slice(0, 4)]; // Visar de senaste 5 sökningarna
      setLatestSearches(updatedSearches);
    }
    setSearchTerm(term);
  };

  return (
    <div>
      <h1>Produktsida</h1>
      <SearchForm setSearchTerm={handleSearchTerm} />
      <LatestSearches latestSearches={latestSearches} setSearchTerm={handleSearchTerm} />
      {status === "loading" && <p>Laddar produkter...</p>}
      {status === "error" && <p>Ett fel uppstod vid hämtningen av produkter.</p>}
      {status === "ok" && (
        <div className="product-card-container">
          {filteredProducts.map((product) => (
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