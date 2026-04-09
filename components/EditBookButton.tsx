"use client";

import { useState } from "react";
import EditBookModal from "@/components/EditBookModal";

interface EditBookButtonProps {
  bookId: string;
  title: string;
  author: string;
  genre: string;
}

export default function EditBookButton({
  bookId,
  title,
  author,
  genre,
}: EditBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Edit book"
        className="inline-flex cursor-pointer items-center justify-center rounded-md border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-black dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        ✎
      </button>
      <EditBookModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookId={bookId}
        initialTitle={title}
        initialAuthor={author}
        initialGenre={genre}
      />
    </>
  );
}
