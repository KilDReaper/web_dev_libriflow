"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface BookCard {
  _id?: string;
  title?: string;
  author?: string;
  coverImageUrl?: string;
  rating?: number;
  genre?: string[];
}

const fallbackBooks = [
  { title: "Clean Architecture", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: "📘" },
  { title: "Flutter Development", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: "📕" },
  { title: "Node.js APIs", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: "📗" },
];

const normalizeList = (payload: any): BookCard[] => {
  const data = payload?.data ?? payload?.items ?? payload?.recommendations ?? payload;
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};

export default function LibraryPage() {
  const [recommended, setRecommended] = useState<BookCard[]>([]);
  const [trending, setTrending] = useState<BookCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<string>("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const [recommendRes, trendingRes] = await Promise.all([
          api.get("/books/recommendations"),
          api.get("/books/recommendations/trending"),
        ]);

        setRecommended(normalizeList(recommendRes.data));
        setTrending(normalizeList(trendingRes.data));
      } catch (err: any) {
        setErrorInfo(err?.response?.data?.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Digital Library</h1>
            <p className="text-slate-500 mt-1">Explore your collection and AI-powered picks.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100">
            Browse All
          </button>
        </div>

        {errorInfo && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm">
            {errorInfo}
          </div>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recommended For You</h2>
              <p className="text-slate-500 text-sm">Personalized suggestions based on your activity.</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">AI Picks</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallbackBooks.map((book, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl bg-white border ${book.border} shadow-sm animate-pulse`}
                >
                  <div className={`w-14 h-14 ${book.bg} rounded-2xl mb-4`}></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recommended.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
              <p className="text-slate-500">No recommendations yet. Start borrowing to personalize your feed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((book, index) => (
                <div
                  key={book._id || index}
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-14 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-2xl">
                      {book.coverImageUrl ? (
                        <img
                          src={book.coverImageUrl}
                          alt={book.title || "Recommended book"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "📘"
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {book.title || "Untitled Book"}
                      </h3>
                      <p className="text-sm text-slate-500">{book.author || "Unknown author"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(book.genre || []).slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400">AI match</span>
                    <span className="font-bold text-indigo-600">
                      {book.rating ? `${book.rating.toFixed(1)} / 5` : "New"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
              <p className="text-slate-500 text-sm">What everyone is reading this week.</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Hot List</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallbackBooks.map((book, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl bg-white border ${book.border} shadow-sm animate-pulse`}
                >
                  <div className={`w-14 h-14 ${book.bg} rounded-2xl mb-4`}></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : trending.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
              <p className="text-slate-500">No trending books right now. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.map((book, index) => (
                <div
                  key={book._id || index}
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-14 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-2xl">
                      {book.coverImageUrl ? (
                        <img
                          src={book.coverImageUrl}
                          alt={book.title || "Trending book"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "📙"
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {book.title || "Untitled Book"}
                      </h3>
                      <p className="text-sm text-slate-500">{book.author || "Unknown author"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(book.genre || []).slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-1 rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Trending</span>
                    <span className="font-bold text-amber-600">
                      {book.rating ? `${book.rating.toFixed(1)} / 5` : "Rising"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}