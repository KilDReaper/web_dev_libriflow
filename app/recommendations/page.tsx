"use client";

import { useState } from "react";
import api from "@/lib/api";

interface RecommendedBook {
  _id?: string;
  externalId?: string;
  source?: string;
  title?: string;
  author?: string;
  coverImageUrl?: string;
  rating?: number;
  genre?: string[];
  description?: string;
  isExternal?: boolean;
  previewLink?: string;
  buyLink?: string;
}

const extractRecommendations = (payload: any): RecommendedBook[] => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.recommendations)) {
    return data.recommendations;
  }
  if (Array.isArray(data?.items)) {
    return data.items;
  }
  return [];
};

function BookViewerModal({ book, onClose }: { book: RecommendedBook; onClose: () => void }) {
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

function BookCard({ 
  book, 
  source, 
  onPreview 
}: { 
  book: RecommendedBook; 
  source: "library" | "external";
  onPreview?: (book: RecommendedBook) => void;
}) {
  const isExternal = source === "external";
  const canPreview = isExternal && book.source === "google_books" && book.externalId;

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="flex items-start gap-4">
        <div className="h-24 w-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-2xl flex-shrink-0">
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
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 line-clamp-2">
            {book.title || "Untitled Book"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {book.author || "Unknown author"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(book.genre || []).slice(0, 2).map((item, idx) => (
              <span
                key={idx}
                className={isExternal 
                  ? "text-xs font-semibold uppercase tracking-wide text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full"
                  : "text-xs font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                }
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 line-clamp-2">
        {book.description || "Explore this recommended title."}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          {isExternal ? (
            <span className="flex items-center gap-1">
              🌐 {book.source === "google_books" ? "Google Books" : "Open Library"}
            </span>
          ) : (
            "📚 In Library"
          )}
        </span>
        <span className={isExternal ? "font-bold text-purple-600" : "font-bold text-emerald-600"}>
          {book.rating ? `${book.rating.toFixed(1)} / 5` : "New"}
        </span>
      </div>
      {canPreview && (
        <button
          onClick={() => onPreview?.(book)}
          className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
        >
          📖 Preview Book
        </button>
      )}
      {isExternal && book.previewLink && !canPreview && (
        <a
          href={book.previewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs font-semibold text-purple-600 hover:text-purple-700 underline"
        >
          View Details →
        </a>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  const [dataType, setDataType] = useState<"academic" | "non-academic">("academic");
  const [classLevel, setClassLevel] = useState("");
  const [course, setCourse] = useState("");
  const [source, setSource] = useState<"library" | "external" | "both">("both");
  const [results, setResults] = useState<RecommendedBook[]>([]);
  const [externalResults, setExternalResults] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");
  const [viewingBook, setViewingBook] = useState<RecommendedBook | null>(null);

  const handlePreviewBook = (book: RecommendedBook) => {
    setViewingBook(book);
  };

  const handleClosePreview = () => {
    setViewingBook(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorInfo("");

    if (dataType === "academic" && (!classLevel.trim() || !course.trim())) {
      setErrorInfo("Please provide class and course for academic recommendations.");
      return;
    }

    try {
      setLoading(true);
      const trimmedCourse = course.trim();
      
      // Fetch library recommendations if needed
      if (source === "library" || source === "both") {
        const endpoint =
          dataType === "academic" && trimmedCourse
            ? `/books/recommendations/genre/${encodeURIComponent(trimmedCourse)}`
            : "/books/recommendations";

        const response = await api.get(endpoint, {
          params: {
            limit: 12,
            dataType,
            class: classLevel.trim(),
            course: trimmedCourse,
          },
        });

        setResults(extractRecommendations(response.data));
      } else {
        setResults([]);
      }

      // Fetch external recommendations if needed
      if (source === "external" || source === "both") {
        const query = dataType === "academic" && trimmedCourse
          ? `${trimmedCourse} ${classLevel.trim()}`.trim()
          : "popular books";

        const externalResponse = await api.get("/books/recommendations/external", {
          params: {
            q: query,
            limit: 12,
          },
        });

        setExternalResults(extractRecommendations(externalResponse.data));
      } else {
        setExternalResults([]);
      }
    } catch (err: any) {
      setErrorInfo(err?.response?.data?.message || "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      {/* Book Viewer Modal */}
      {viewingBook && (
        <BookViewerModal book={viewingBook} onClose={handleClosePreview} />
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600">AI Lab</p>
          <h1 className="text-4xl font-black text-slate-900 mt-3">
            Smart Recommendations
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Tell us your context and we will recommend the most relevant books.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recommendation Inputs</h2>
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Step 1
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Data Type</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDataType("academic")}
                    className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                      dataType === "academic"
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                    }`}
                  >
                    Academic
                  </button>
                  <button
                    type="button"
                    onClick={() => setDataType("non-academic")}
                    className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                      dataType === "non-academic"
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    Non Academic
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Book Source</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSource("library")}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      source === "library"
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    Library
                  </button>
                  <button
                    type="button"
                    onClick={() => setSource("external")}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      source === "external"
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"
                    }`}
                  >
                    External
                  </button>
                  <button
                    type="button"
                    onClick={() => setSource("both")}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      source === "both"
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              {dataType === "academic" && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Class</label>
                    <input
                      value={classLevel}
                      onChange={(event) => setClassLevel(event.target.value)}
                      placeholder="e.g. Class 12"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Course</label>
                    <input
                      value={course}
                      onChange={(event) => setCourse(event.target.value)}
                      placeholder="e.g. Physics"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Course is matched against genre labels in the catalog.
                    </p>
                  </div>
                </>
              )}

              {dataType === "non-academic" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  We will use your activity and trending data to recommend books.
                </div>
              )}
            </div>

            {errorInfo && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorInfo}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-60"
            >
              {loading ? "Finding the best books..." : "Get Recommendations"}
            </button>
          </form>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Recommended Books</h2>
                <p className="text-slate-500 text-sm">
                  Curated results from {source === "library" ? "your library" : source === "external" ? "external sources (Google Books, Open Library)" : "library and external sources"}.
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Step 2
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-white p-5 animate-pulse"
                  >
                    <div className="h-24 w-16 rounded-2xl bg-slate-200 mb-4"></div>
                    <div className="h-4 w-3/4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 && externalResults.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-slate-500">
                  No recommendations yet. Submit the form to generate results.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Library Results */}
                {results.length > 0 && (source === "library" || source === "both") && (
                  <div>
                    <h3 className="text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
                      From Your Library ({results.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.map((book, index) => (
                        <BookCard 
                          key={book._id || index} 
                          book={book} 
                          source="library"
                          onPreview={handlePreviewBook}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* External Results */}
                {externalResults.length > 0 && (source === "external" || source === "both") && (
                  <div>
                    <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-600"></span>
                      From External Sources ({externalResults.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {externalResults.map((book, index) => (
                        <BookCard 
                          key={book.externalId || index} 
                          book={book} 
                          source="external"
                          onPreview={handlePreviewBook}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
