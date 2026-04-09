"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
}

export default function DeleteBookModal({
  isOpen,
  onClose,
  bookId,
}: DeleteBookModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete book");
      }

      onClose();
      router.push("/manage?tab=books");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Delete Book
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          This will delete this book. Do you wish to proceed?
        </p>

        {error && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            disabled={isSubmitting}
          >
            No
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
}
