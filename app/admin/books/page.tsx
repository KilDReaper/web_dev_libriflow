"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string[];
  publisher?: string;
  publishedDate?: string;
  stockQuantity: number;
  availableQuantity: number;
  coverImageUrl?: string;
}

interface InventoryStats {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [errorInfo, setErrorInfo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, statsRes] = await Promise.all([
        api.get("/admin/books"),
        api.get("/admin/books/inventory-stats"),
      ]);

      const booksData = booksRes.data?.data || booksRes.data;
      const statsData = statsRes.data?.data || statsRes.data;

      if (Array.isArray(booksData)) {
        setBooks(booksData);
      }
      if (statsData) {
        setStats(statsData);
      }
    } catch (err: any) {
      setErrorInfo(err.response?.data?.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/admin/books/search?q=${searchQuery}`);
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setBooks(data);
      }
    } catch (err: any) {
      setErrorInfo(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/admin/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
      fetchData(); // Refresh stats
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Inventory</h1>
            <p className="text-gray-500 text-sm">Manage your library collection</p>
          </div>
          <Link
            href="/admin/books/create"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            + Add New Book
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Total Books</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBooks}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Total Copies</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalCopies}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.availableCopies}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Borrowed</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.borrowedCopies}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by title, author, ISBN, or category..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchQuery("");
                fetchData();
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {errorInfo && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {errorInfo}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No books found</p>
            <Link
              href="/admin/books/create"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              Add your first book
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{book.title}</p>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <p className="text-xs text-gray-400">
                          {book.publisher} • {book.publishedDate ? new Date(book.publishedDate).getFullYear() : "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{book.isbn}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {Array.isArray(book.genre) ? book.genre[0] : book.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-medium text-green-600">{book.availableQuantity}</span>
                      <span className="text-gray-400"> / {book.stockQuantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      {book.availableQuantity > 0 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/books/${book._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
