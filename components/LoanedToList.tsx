"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoanedToItem {
  id: string;
  fullName: string;
}

interface LoanedToListProps {
  bookId: string;
  subscribers: LoanedToItem[];
}

export default function LoanedToList({
  bookId,
  subscribers,
}: LoanedToListProps) {
  const router = useRouter();
  const [items, setItems] = useState<LoanedToItem[]>(subscribers);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(subscribers);
  }, [subscribers]);

  const handleReturnBook = async (subscriberId: string) => {
    setSubmittingId(subscriberId);
    try {
      const res = await fetch(`/api/subscribers/${subscriberId}/loans`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book: [bookId] }),
      });

      if (!res.ok) {
        throw new Error("Failed to return book");
      }

      setItems((prev) => prev.filter((item) => item.id !== subscriberId));
      router.refresh();
    } catch (error) {
      console.error("Return book error:", error);
    } finally {
      setSubmittingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Not currently loaned.
      </p>
    );
  }

  return (
    <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
      {items.map((subscriber) => (
        <li key={subscriber.id} className="flex items-center gap-3">
          <span>{subscriber.fullName}</span>
          <button
            type="button"
            onClick={() => handleReturnBook(subscriber.id)}
            disabled={submittingId === subscriber.id}
            className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {submittingId === subscriber.id ? "Returning..." : "Return Book"}
          </button>
        </li>
      ))}
    </ul>
  );
}
