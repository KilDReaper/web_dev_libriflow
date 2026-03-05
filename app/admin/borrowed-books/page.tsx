"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import BackButton from "@/app/_components/BackButton";

interface BorrowedBook {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    coverImageUrl?: string;
  };
  user: {
    _id: string;
    username: string;
    email: string;
    phoneNumber?: string;
  };
  borrowDate: string;
  dueDate: string;
  returnedDate?: string;
  status: "active" | "returned" | "overdue" | "lost";
  fineAmount?: number;
  finePaid?: boolean;
}

interface BorrowingStats {
  totalBorrows: number;
  activeBorrows: number;
  overdueBooks: number;
  returnedBooks: number;
}

export default function AdminBorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [stats, setStats] = useState<BorrowingStats | null>(null);
  const [errorInfo, setErrorInfo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "returned" | "overdue" | "lost">("all");

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === "all" ? "" : `?status=${filter}`;
      
      // Only fetch borrows, skip stats for now
      const borrowsRes = await api.get(`/borrowings${statusFilter}`);
      
      /* TODO: Uncomment when backend stats endpoint is ready
      const [borrowsRes, statsRes] = await Promise.all([
        api.get(`/borrowings${statusFilter}`),
        api.get("/borrowings/stats"),
      ]);
      */

      const borrowsData = borrowsRes.data?.data || borrowsRes.data;
      // const statsData = statsRes.data?.data || statsRes.data;

      if (Array.isArray(borrowsData)) {
        setBorrowedBooks(borrowsData);
      }
      
      // Set default stats until backend is ready
      setStats({
        totalBorrows: 0,
        activeBorrows: 0,
        overdueBooks: 0,
        returnedBooks: 0,
      });
      
      /* TODO: Uncomment when backend stats endpoint is ready
      // Transform backend stats format to match frontend expectations
      if (statsData) {
        const transformedStats: BorrowingStats = {
          totalBorrows: Object.values(statsData.byStatus || {}).reduce(
            (sum: number, status: any) => sum + (status.count || 0), 0
          ),
          activeBorrows: statsData?.byStatus?.active?.count || 0,
          overdueBooks: statsData?.byStatus?.overdue?.count || 0,
          returnedBooks: statsData?.byStatus?.returned?.count || 0,
        };
        setStats(transformedStats);
      }
      */
    } catch (err: any) {
      setErrorInfo(err.response?.data?.message || "Failed to fetch borrowed books");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowId: string) => {
    if (!confirm("Mark this book as returned?")) return;

    try {
      await api.post(`/borrowings/${borrowId}/return`);
      fetchData(); // Refresh data
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to return book");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === "active" && new Date(dueDate) < new Date();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-blue-100 text-blue-800",
      returned: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      lost: "bg-gray-100 text-gray-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <BackButton className="mb-4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Borrowed Books</h1>
            <p className="text-gray-500 text-sm">Track and manage borrowed books</p>
          </div>
          <Link
            href="/admin/books"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            View Inventory
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Total Borrows</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBorrows}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeBorrows}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdueBooks}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">Returned</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.returnedBooks}</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {["all", "active", "overdue", "returned", "lost"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as typeof filter)}
                className={`flex-1 px-6 py-3 text-sm font-medium capitalize transition-colors ${
                  filter === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
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
            <p className="text-gray-500 mt-4">Loading borrowed books...</p>
          </div>
        ) : borrowedBooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No borrowed books found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrower
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrow Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
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
                  {borrowedBooks.map((borrow) => {
                    const overdueStatus = isOverdue(borrow.dueDate, borrow.status);
                    return (
                      <tr
                        key={borrow._id}
                        className={`hover:bg-gray-50 ${overdueStatus ? "bg-red-50" : ""}`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {borrow.book.title}
                            </p>
                            <p className="text-sm text-gray-500">{borrow.book.author}</p>
                            <p className="text-xs text-gray-400">ISBN: {borrow.book.isbn}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {borrow.user.username}
                            </p>
                            <p className="text-xs text-gray-500">{borrow.user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(borrow.borrowDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className={overdueStatus ? "text-red-600 font-medium" : "text-gray-900"}>
                              {formatDate(borrow.dueDate)}
                            </p>
                            {overdueStatus && (
                              <p className="text-xs text-red-500 mt-1">Overdue!</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {borrow.returnedDate ? formatDate(borrow.returnedDate) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(
                              borrow.status
                            )}`}
                          >
                            {borrow.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          {borrow.status === "active" || borrow.status === "overdue" ? (
                            <button
                              onClick={() => handleReturn(borrow._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Mark Returned
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
