"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <h2>Search</h2>

      <input
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={input}
      />

      {query && <p>Searching for: {query}</p>}
    </div>
  );
}

const input = {
  padding: 10,
  width: "100%",
  borderRadius: 6,
  border: "1px solid #ccc",
};
