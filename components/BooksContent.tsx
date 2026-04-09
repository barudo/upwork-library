"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AddBookModal from "@/components/AddBookModal";

interface Subscriber {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  borrower: Subscriber | null;
}

export default function BooksContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReady, setIsReady] = useState(false);

  const fetchBooks = async (query: string) => {
    setLoading(true);
    try {
      const url = query.trim()
        ? `/api/books?q=${encodeURIComponent(query.trim())}`
        : "/api/books";
      const res = await fetch(url, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q") ?? "";
    setSearchQuery(query);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    const search = params.toString();
    const nextUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
    fetchBooks(searchQuery);
  }, [isReady, searchQuery]);

  const handleBookAdded = () => {
    fetchBooks(searchQuery); // Refresh the books list
  };

  if (loading) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">
        Loading books...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Books
          </h2>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title, author, genre"
            className="w-full sm:w-72 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDisplayMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              displayMode === "grid"
                ? "bg-black text-white dark:bg-zinc-50 dark:text-black"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            onClick={() => setDisplayMode("table")}
            className={`p-2 rounded-md transition-colors ${
              displayMode === "table"
                ? "bg-black text-white dark:bg-zinc-50 dark:text-black"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="Table view"
          >
            ⊟
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-4 rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Add New Book
          </button>
        </div>
      </div>
      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              key={book._id}
              href={`/books/${book._id}`}
              className="block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                {book.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-1">
                Author: {book.author}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mb-1">
                Genre:{" "}
                <Link
                  href={`/genres/${encodeURIComponent(book.genre)}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {book.genre}
                </Link>
              </p>
              {book.borrower ? (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Borrowed by: {book.borrower.firstName}{" "}
                  {book.borrower.lastName}
                </p>
              ) : (
                <p className="text-green-600 dark:text-green-400 text-sm">
                  Available
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-zinc-300 dark:border-zinc-600">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900">
                <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-left text-black dark:text-zinc-50">
                  Title
                </th>
                <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-left text-black dark:text-zinc-50">
                  Author
                </th>
                <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-left text-black dark:text-zinc-50">
                  Genre
                </th>
                <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-left text-black dark:text-zinc-50">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book._id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">
                    <Link
                      href={`/books/${book._id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-zinc-600 dark:text-zinc-400">
                    {book.author}
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">
                    <Link
                      href={`/genres/${encodeURIComponent(book.genre)}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {book.genre}
                    </Link>
                  </td>
                  <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">
                    {book.borrower ? (
                      <span className="text-red-600 dark:text-red-400">
                        Borrowed by {book.borrower.firstName}{" "}
                        {book.borrower.lastName}
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">
                        Available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
    </>
  );
}
