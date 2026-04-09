"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GENRE_OPTIONS } from "@/lib/constants";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  initialTitle: string;
  initialAuthor: string;
  initialGenre: string;
}

export default function EditBookModal({
  isOpen,
  onClose,
  bookId,
  initialTitle,
  initialAuthor,
  initialGenre,
}: EditBookModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [genre, setGenre] = useState(initialGenre);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setTitle(initialTitle);
    setAuthor(initialAuthor);
    setGenre(initialGenre);
    setError("");
  }, [isOpen, initialTitle, initialAuthor, initialGenre]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          genre: genre.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update book");
      }

      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Edit Book
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Update the book details below.
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-zinc-50 dark:focus:ring-zinc-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-author"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Author
            </label>
            <input
              id="edit-author"
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-zinc-50 dark:focus:ring-zinc-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-genre"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Genre
            </label>
            <select
              id="edit-genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-zinc-50 dark:focus:ring-zinc-50"
              required
            >
              <option value="">Select a genre</option>
              {GENRE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
