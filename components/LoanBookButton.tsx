"use client";

import { useState } from "react";
import LoanBookModal from "@/components/LoanBookModal";

interface LoanBookButtonProps {
  bookId: string;
}

export default function LoanBookButton({ bookId }: LoanBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
      >
        Loan Book
      </button>
      <LoanBookModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookId={bookId}
      />
    </>
  );
}
