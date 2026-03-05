"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import BackButton from "@/app/_components/BackButton";

interface BookCard {
  _id?: string;
  externalId?: string;
  title?: string;
  author?: string;
  coverImageUrl?: string;
  rating?: number;
  genre?: string[];
  source?: string;
  previewLink?: string;
}

const fallbackBooks = [
  { title: "Clean Architecture", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: "📘" },
  { title: "Flutter Development", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: "📕" },
  { title: "Node.js APIs", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: "📗" },
];

const normalizeList = (payload: any): BookCard[] => {
  const data = payload?.data ?? payload?.items ?? payload?.recommendations ?? payload;
  // Handle nested recommendations from external API
  if (data?.recommendations && Array.isArray(data.recommendations)) {
    return data.recommendations;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};

function BookDetailModal({ book, onClose }: { book: BookCard; onClose: () => void }) {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleBorrow = async () => {
    if (!book._id && !book.externalId) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      // For library books (with _id)
      if (book._id) {
        await api.post("/borrowings", { bookId: book._id });
      }
      // For external/Google Books (with externalId)
      else if (book.externalId) {
        await api.post("/borrowings", {
          externalId: book.externalId,
          title: book.title,
          author: book.author,
          coverImageUrl: book.coverImageUrl,
        });
      }
      setActionMessage({ type: 'success', text: 'Book borrowed successfully!' });
    } catch (error: any) {
      setActionMessage({ 
        type: 'error', 
        text: error?.response?.data?.message || 'Failed to borrow book' 
      });
    } finally {
      setActionLoading(false);
    }
  };


  const handleReserve = async () => {
    if (!book._id && !book.externalId) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      // For library books (with _id)
      if (book._id) {
        await api.post("/reservations", { bookId: book._id });
      }
      // For external/Google Books (with externalId)
      else if (book.externalId) {
        await api.post("/reservations", {
          externalId: book.externalId,
          title: book.title,
          author: book.author,
          coverImageUrl: book.coverImageUrl,
        });
      }
      setActionMessage({ type: 'success', text: 'Book reserved successfully!' });
    } catch (error: any) {
      setActionMessage({ 
        type: 'error', 
        text: error?.response?.data?.message || 'Failed to reserve book' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!book._id && !book.externalId) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      // For library books (with _id)
      if (book._id) {
        await api.post("/purchases", { bookId: book._id, purchaseType: "buy", price: 0 });
      }
      // For external/Google Books (with externalId)
      else if (book.externalId) {
        await api.post("/purchases", { 
          externalId: book.externalId,
          title: book.title,
          author: book.author,
          coverImageUrl: book.coverImageUrl,
          purchaseType: "buy", 
          price: 0 
        });
      }
      setActionMessage({ type: 'success', text: 'Book purchased successfully!' });
    } catch (error: any) {
      setActionMessage({ 
        type: 'error', 
        text: error?.response?.data?.message || 'Failed to purchase book' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 w-10 h-10 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-all shadow-lg"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Book Header */}
          <div className="flex gap-6 mb-6">
            <div className="h-48 w-32 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-4xl flex-shrink-0">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                "📚"
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{book.title}</h1>
              <p className="text-lg text-slate-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-500">★</span>
                  <span className="text-lg font-semibold text-slate-900">
                    {book.rating ? book.rating.toFixed(1) : 'New'}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <span className="text-sm text-slate-600">External Book</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(book.genre || []).map((g) => (
                  <span
                    key={g}
                    className="text-xs font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About This Book</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              {book.coverImageUrl ? 
                "This is an external book from Google Books. You can preview sample pages and learn more about the book." 
                : "No description available for this book at the moment."}
            </p>

            {/* Book Details Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
              {book.author && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Author</p>
                  <p className="text-slate-900 font-semibold">{book.author}</p>
                </div>
              )}
              {book.genre && book.genre[0] && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Category</p>
                  <p className="text-slate-900 font-semibold">{book.genre[0]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Messages */}
          {actionMessage && (
            <div className={`mb-6 p-4 rounded-xl ${
              actionMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {actionMessage.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleBorrow}
              disabled={actionLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {actionLoading ? '...' : '📚 Borrow'}
            </button>
            <button
              onClick={handleReserve}
              disabled={actionLoading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {actionLoading ? '...' : '📅 Reserve'}
            </button>
            <button
              onClick={handleBuy}
              disabled={actionLoading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {actionLoading ? '...' : '💳 Buy'}
            </button>
          </div>

          {book.previewLink && (
            <div className="mt-4">
              <a
                href={book.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all text-sm"
              >
                🔗 Preview on Google Books
              </a>
            </div>
          )}

          <p className="text-xs text-slate-500 text-center mt-4">
            Choose an action above to perform it on this book
          </p>
        </div>
      </div>
    </div>
  );
}

function BookViewerModal({ book, onClose }: { book: BookCard; onClose: () => void }) {
  if (!book.externalId || book.source !== "google_books") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-white to-transparent p-4 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-slate-900 truncate">{book.title}</h2>
            <p className="text-sm text-slate-600 truncate">{book.author}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Google Books Embedded Viewer */}
        <iframe
          src={`https://books.google.com/books?id=${book.externalId}&lpg=PP1&pg=PP1&output=embed`}
          className="w-full h-full border-0"
          allowFullScreen
        />

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">Powered by Google Books</span>
          {book.previewLink && (
            <a
              href={book.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 underline"
            >
              Open in Google Books →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [recommended, setRecommended] = useState<BookCard[]>([]);
  const [trending, setTrending] = useState<BookCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string>("");
  const [viewingBook, setViewingBook] = useState<BookCard | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookCard | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const getRandomQuery = () => {
    const queries = ["bestsellers", "popular books", "top rated", "new releases", "trending books", "must read"];
    return queries[Math.floor(Math.random() * queries.length)];
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const randomQuery = getRandomQuery();
        const [recommendRes, trendingRes] = await Promise.all([
          api.get("/books/recommendations"),
          api.get("/books/recommendations/external", { params: { q: randomQuery, limit: 12 } }),
        ]);

        setRecommended(normalizeList(recommendRes.data));
        console.log("Trending response:", trendingRes.data);
        setTrending(normalizeList(trendingRes.data));
      } catch (err: any) {
        console.error("Fetch error:", err);
        setErrorInfo(err?.response?.data?.message || err.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [refreshKey]);

  const handlePreviewBook = (book: BookCard) => {
    setViewingBook(book);
  };

  const handleClosePreview = () => {
    setViewingBook(null);
  };

  const handleSelectBook = (book: BookCard) => {
    setSelectedBook(book);
  };

  const handleCloseDetails = () => {
    setSelectedBook(null);
  };

  const handleRefreshTrending = async () => {
    setTrendingLoading(true);
    try {
      const randomQuery = getRandomQuery();
      const trendingRes = await api.get("/books/recommendations/external", { 
        params: { q: randomQuery, limit: 12 } 
      });
      setTrending(normalizeList(trendingRes.data));
    } catch (err: any) {
      console.error("Refresh error:", err);
      setErrorInfo(err?.response?.data?.message || err.message || "Failed to refresh trending books");
    } finally {
      setTrendingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Book Detail Modal */}
      {selectedBook && <BookDetailModal book={selectedBook} onClose={handleCloseDetails} />}

      {/* Book Viewer Modal */}
      {viewingBook && <BookViewerModal book={viewingBook} onClose={handleClosePreview} />}

      <div className="max-w-6xl mx-auto">
        <BackButton className="mb-4" />
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
                <button
                  key={book._id || index}
                  onClick={() => handleSelectBook(book)}
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
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
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
              <p className="text-slate-500 text-sm">Popular books from Google Books.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefreshTrending}
                disabled={trendingLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-md shadow-purple-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${trendingLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {trendingLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-600">Google Books</span>
            </div>
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
                <button
                  key={book.externalId || index}
                  onClick={() => handleSelectBook(book)}
                  className="group relative p-6 rounded-2xl bg-white border border-purple-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
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
                      <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">
                        {book.title || "Untitled Book"}
                      </h3>
                      <p className="text-sm text-slate-500">{book.author || "Unknown author"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(book.genre || []).slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-xs font-semibold uppercase tracking-wide text-purple-600 bg-purple-50 px-2 py-1 rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400">🌐 Google Books</span>
                    <span className="font-bold text-purple-600">
                      {book.rating ? `${book.rating.toFixed(1)} / 5` : "New"}
                    </span>
                  </div>

                  {book.source === "google_books" && book.externalId && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewBook(book);
                      }}
                      className="mt-3 w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 cursor-pointer text-center"
                    >
                      📖 Preview Book
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}