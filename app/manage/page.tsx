"use client";

import { useState } from "react";
import AddBookModal from "@/components/AddBookModal";

export default function ManageLibrary() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookAdded = () => {
    // Could add logic to refresh data or show success message
    console.log("Book added successfully");
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Manage Library
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Add, edit, and manage your library&apos;s books and subscribers.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Add New Book
          </button>
        </div>
      </main>

      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
    </div>
  );
}
