"use client";

import { useState, useEffect } from "react";
import BackButton from "@/app/_components/BackButton";
import api from "@/lib/api";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string[];
  publisher?: string;
  publishedDate?: string;
  coverImageUrl?: string;
  stockQuantity?: number;
  availableQuantity?: number;
  description?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [hasSearched, setHasSearched] = useState(false);

  const genres = ["all", "Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Fantasy", "Mystery", "Romance"];

  useEffect(() => {
    if (query.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500); // Debounce search
      return () => clearTimeout(timeoutId);
    } else if (query.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
    }
  }, [query, selectedGenre, sortBy]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params: any = { q: query };
      if (selectedGenre !== "all") {
        params.genre = selectedGenre;
      }

      const response = await api.get("/admin/books/search", { params });
      const data = response.data?.data || response.data || [];
      
      let sortedResults = Array.isArray(data) ? data : [];
      
      // Apply sorting
      if (sortBy === "title") {
        sortedResults.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "author") {
        sortedResults.sort((a, b) => a.author.localeCompare(b.author));
      } else if (sortBy === "newest") {
        sortedResults.sort((a, b) => new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime());
      }

      setResults(sortedResults);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || "Failed to search. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <BackButton className="mb-6" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Search Library
          </h2>
          <p className="text-slate-500 font-medium">
            Find books, authors, or technical documentation in seconds.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search by title, author, ISBN, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-32 py-5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg"
            />

            <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {(query || hasSearched) && (
          <div className="max-w-3xl mx-auto mb-8 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <label className="text-sm font-semibold text-slate-700">Genre:</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === "all" ? "All Genres" : genre}
                  </option>
                ))}
              </select>

              <label className="text-sm font-semibold text-slate-700 ml-4">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="title">Title (A-Z)</option>
                <option value="author">Author (A-Z)</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {hasSearched && (
              <div className="text-sm text-slate-600">
                <span className="font-semibold">{results.length}</span> result{results.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium mt-4">Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-5"
              >
                <div className="flex flex-col h-full">
                  {/* Book Cover */}
                  <div className="mb-4 h-48 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-5xl">📚</div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      by {book.author}
                    </p>

                    {/* Genres */}
                    {book.genre && book.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {book.genre.slice(0, 2).map((g, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ISBN */}
                    {book.isbn && (
                      <p className="text-xs text-slate-500 mb-3">
                        ISBN: {book.isbn}
                      </p>
                    )}

                    {/* Availability */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="text-xs">
                        {book.availableQuantity !== undefined && book.availableQuantity > 0 ? (
                          <span className="text-green-600 font-semibold">
                            ✓ Available ({book.availableQuantity})
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            ✗ Unavailable
                          </span>
                        )}
                      </div>
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No books found</h3>
            <p className="text-slate-500 mb-6 text-center max-w-md">
              We couldn't find any books matching "{query}". Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedGenre("all");
                setHasSearched(false);
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !query && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Start searching</h3>
              <p className="text-slate-500">
                Enter a book title, author, ISBN, or category to get started
              </p>
            </div>

            {/* Quick Search Suggestions */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Popular searches:</h4>
              <div className="flex flex-wrap gap-2">
                {["Clean Code", "JavaScript", "Python", "Database", "Algorithm", "Machine Learning"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}