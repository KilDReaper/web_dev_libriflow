"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-[40vh] bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Search Library
          </h2>
          <p className="text-slate-500 font-medium">
            Find books, authors, or technical documentation in seconds.
          </p>
        </div>

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
            placeholder="Search by title, ISBN, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg"
          />

          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {query ? (
              <button 
                onClick={() => setQuery("")}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              >
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded">
                ⌘ K
              </kbd>
            )}
          </div>
        </div>

        {query && (
          <div className="mt-6 flex items-center justify-center animate-in fade-in slide-in-from-top-2">
            <span className="text-sm text-slate-400 mr-2">Results for</span>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
              "{query}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
}