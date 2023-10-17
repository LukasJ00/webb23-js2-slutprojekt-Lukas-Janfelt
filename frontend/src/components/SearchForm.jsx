import React, { useState } from "react";

export default function SearchForm({ setSearchTerm }) {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Sök produkter"
        value={searchInput}
        onChange={handleInputChange}
      />
      <button type="submit">Sök</button>
    </form>
  );
}