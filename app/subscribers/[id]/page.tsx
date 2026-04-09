"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, use } from "react";
import { useParams } from "next/navigation";

interface LoanItem {
  bookId: string;
  loanedAt: string;
  bookObject?: {
    _id: string;
    title: string;
    author: string;
    genre: string;
  } | null;
}

interface Subscriber {
  _id: string;
  firstName: string;
  lastName: string;
  loans?: LoanItem[];
}

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SubscriberPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [loanError, setLoanError] = useState<string | null>(null);

  const fetchSubscriber = useCallback(async () => {
    try {
      const res = await fetch(`/api/subscribers/${id}`);
      if (!res.ok) {
        throw new Error("Subscriber not found");
      }
      const data = await res.json();
      setSubscriber(data);
    } catch (error) {
      console.error("Error fetching subscriber:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const searchBooks = async (query: string) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const books = await res.json();
        setSearchResults(books);
      }
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleLoanBook = async (bookId: string) => {
    try {
      const res = await fetch(`/api/subscribers/${id}/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: bookId }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setLoanError(null);
        fetchSubscriber(); // Refresh subscriber data
      } else {
        const errorData = await res.json();
        setLoanError(errorData.error || "Failed to loan book");
      }
    } catch (error) {
      console.error("Error loaning book:", error);
      setLoanError("An unexpected error occurred");
    }
  };

  useEffect(() => {
    fetchSubscriber();
  }, [fetchSubscriber]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchBooks(searchQuery);
      }, 300); // Debounce search
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">
          Loading subscriber...
        </div>
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">
          Subscriber not found
        </div>
      </div>
    );
  }

  const fullName = `${subscriber.firstName} ${subscriber.lastName}`;
  const loans = subscriber.loans ?? [];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Link
          href="/manage"
          className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white mb-8"
        >
          ← Back to Manage Library
        </Link>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Subscriber Details
          </h1>
          <div className="text-lg space-y-3">
            <p className="text-zinc-600 dark:text-zinc-400">
              <strong>Full name:</strong> {fullName}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              <strong>Subscriber ID:</strong> {subscriber._id}
            </p>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold leading-9 text-black dark:text-zinc-50">
                Loaned Books
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setLoanError(null);
                }}
                className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Loan Book
              </button>
            </div>
            {loans.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No books currently loaned.
              </p>
            ) : (
              <div className="space-y-4">
                {loans.map((loan) => (
                  <div
                    key={`${loan.bookId}-${loan.loanedAt}`}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-4"
                  >
                    <p className="text-zinc-700 dark:text-zinc-200 mb-2">
                      <strong>Loaned At:</strong>{" "}
                      {new Date(loan.loanedAt).toLocaleString()}
                    </p>
                    {loan.bookObject ? (
                      <div className="space-y-1 text-zinc-600 dark:text-zinc-300">
                        <p>
                          <strong>Title:</strong> {loan.bookObject.title}
                        </p>
                        <p>
                          <strong>Author:</strong> {loan.bookObject.author}
                        </p>
                        <p>
                          <strong>Genre:</strong> {loan.bookObject.genre}
                        </p>
                      </div>
                    ) : (
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Book details unavailable for ID {loan.bookId}
                      </p>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `/api/subscribers/${id}/loans`,
                              {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ book: loan.bookId }),
                              },
                            );

                            if (!response.ok) {
                              const data = await response.json();
                              alert(`Error: ${data.error}`);
                              return;
                            }

                            // Refresh subscriber data
                            fetchSubscriber();
                          } catch (error) {
                            alert("Failed to return book");
                          }
                        }}
                        className="rounded-md bg-red-600 px-3 py-1 text-white text-sm hover:bg-red-700"
                      >
                        Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
              Loan Book
            </h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-50"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {searching ? (
                <div className="text-center py-8">
                  <div className="text-zinc-600 dark:text-zinc-400">
                    Searching...
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
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
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((book) => (
                      <tr
                        key={book._id}
                        onClick={() => handleLoanBook(book._id)}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                      >
                        <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline">
                          {book.title}
                        </td>
                        <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-zinc-600 dark:text-zinc-400">
                          {book.author}
                        </td>
                        <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-zinc-600 dark:text-zinc-400">
                          {book.genre}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : searchQuery.trim() ? (
                <div className="text-center py-8">
                  <div className="text-zinc-600 dark:text-zinc-400">
                    No books found matching &quot;{searchQuery}&quot;
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-zinc-600 dark:text-zinc-400">
                    Start typing to search for books
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-300 dark:border-zinc-600">
              {loanError && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {loanError}
                </div>
              )}
              <div className="ml-auto">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                    setLoanError(null);
                  }}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
