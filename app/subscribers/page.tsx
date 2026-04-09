"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AddSubscriberModal from "@/components/AddSubscriberModal";

interface Subscriber {
  _id: string;
  firstName: string;
  lastName: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/subscribers", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch subscribers");
      }
      const data = await res.json();
      setSubscribers(data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">
          Loading subscribers...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col py-32 px-16 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Subscribers
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDisplayMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                displayMode === "grid"
                  ? "bg-black text-white dark:bg-zinc-50 dark:text-black"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              onClick={() => setDisplayMode("table")}
              className={`p-2 rounded-md transition-colors ${
                displayMode === "table"
                  ? "bg-black text-white dark:bg-zinc-50 dark:text-black"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              title="Table view"
            >
              ⊟
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-4 rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Add Subscriber
            </button>
          </div>
        </div>

        {displayMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscribers.map((subscriber) => (
              <Link
                key={subscriber._id}
                href={`/subscribers/${subscriber._id}`}
                className="block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                  {subscriber.firstName} {subscriber.lastName}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Subscriber ID: {subscriber._id}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-zinc-300 dark:border-zinc-600">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-left text-black dark:text-zinc-50">
                    Name
                  </th>
                  <th className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-left text-black dark:text-zinc-50">
                    Subscriber ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2">
                      <Link
                        href={`/subscribers/${subscriber._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {subscriber.firstName} {subscriber.lastName}
                      </Link>
                    </td>
                    <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-zinc-600 dark:text-zinc-400">
                      {subscriber._id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddSubscriberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubscriberAdded={fetchSubscribers}
        />
      </main>
    </div>
  );
}
