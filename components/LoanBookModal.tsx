"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Subscriber {
  _id: string;
  firstName: string;
  lastName: string;
}

interface LoanBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
}

export default function LoanBookModal({
  isOpen,
  onClose,
  bookId,
}: LoanBookModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const searchUrl = useMemo(() => {
    const trimmed = query.trim();
    return trimmed ? `/api/subscribers?q=${encodeURIComponent(trimmed)}` : "/api/subscribers";
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLoading(true);
    setError("");

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(searchUrl, { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch subscribers");
        }
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [isOpen, searchUrl]);

  const handleLoanBook = async (subscriberId: string) => {
    setSubmittingId(subscriberId);
    setError("");
    try {
      const res = await fetch(`/api/subscribers/${subscriberId}/loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book: [bookId] }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to loan book");
      }

      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to loan book");
    } finally {
      setSubmittingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Loan Book
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Search for a subscriber to loan this book.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subscriber name"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-50"
          />
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-4 max-h-80 overflow-auto border border-zinc-200 dark:border-zinc-700">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-black dark:text-zinc-50">
                  Name
                </th>
                <th className="px-3 py-2 text-left font-medium text-black dark:text-zinc-50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-4 text-center text-zinc-600 dark:text-zinc-400"
                  >
                    Loading subscribers...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-4 text-center text-zinc-600 dark:text-zinc-400"
                  >
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                results.map((subscriber) => (
                  <tr key={subscriber._id} className="border-t border-zinc-200 dark:border-zinc-700">
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {subscriber.firstName} {subscriber.lastName}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleLoanBook(subscriber._id)}
                        disabled={submittingId === subscriber._id}
                        className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                      >
                        {submittingId === subscriber._id ? "Loaning..." : "Loan"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
