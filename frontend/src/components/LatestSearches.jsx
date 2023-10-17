import React from "react";

export default function LatestSearches({ latestSearches, setSearchTerm }) {
  return (
    <div className="latest-searches">
      <p>Senaste sökningar:</p>
      {latestSearches.map((search, index) => (
        <button key={index} onClick={() => setSearchTerm(search)}>
          {search}
        </button>
      ))}
    </div>
  );
}