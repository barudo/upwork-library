"use client";

import { useEffect, useState } from "react";
import BooksContent from "@/components/BooksContent";
import SubscribersContent from "@/components/SubscribersContent";

export default function ManageLibrary() {
  const [activeTab, setActiveTab] = useState<"books" | "subscribers">("books");

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab === "books" || tab === "subscribers") {
      setActiveTab(tab);
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-8">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Manage Library
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Add, edit, and manage your library&apos;s books and subscribers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-300 dark:border-zinc-600 mb-8">
          <button
            onClick={() => setActiveTab("books")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "books"
                ? "border-b-2 border-black text-black dark:border-zinc-50 dark:text-zinc-50"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "subscribers"
                ? "border-b-2 border-black text-black dark:border-zinc-50 dark:text-zinc-50"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
            }`}
          >
            Subscribers
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "books" ? <BooksContent /> : <SubscribersContent />}
      </main>
    </div>
  );
}
