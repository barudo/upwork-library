"use client";

import { useState } from "react";
import DeleteBookModal from "@/components/DeleteBookModal";

interface DeleteBookButtonProps {
  bookId: string;
}

export default function DeleteBookButton({ bookId }: DeleteBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Delete book"
        className="inline-flex cursor-pointer items-center justify-center rounded-md border border-red-300 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        🗑
      </button>
      <DeleteBookModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookId={bookId}
      />
    </>
  );
}
