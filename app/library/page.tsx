"use client";

export default function LibraryPage() {
  const books = [
    { title: "Clean Architecture", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: "📘" },
    { title: "Flutter Development", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: "📕" },
    { title: "Node.js APIs", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: "📗" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Digital Library</h1>
            <p className="text-slate-500 mt-1">Explore your collection of resources and guides.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100">
            Browse All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <div 
              key={index}
              className={`group relative p-6 rounded-2xl bg-white border ${book.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              <div className={`w-14 h-14 ${book.bg} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {book.icon}
              </div>
              
              <h3 className={`text-lg font-bold ${book.color} mb-2`}>
                {book.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Master the core concepts of {book.title.split(' ')[0]} with this comprehensive guide and documentation.
              </p>

              <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                <span>View Details</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}