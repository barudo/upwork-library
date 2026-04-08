"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
                Add Subscriber
              </h2>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  setSubmitError("");
                  setSubmitting(true);

                  try {
                    const response = await fetch("/api/subscribers", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ firstName, lastName }),
                    });

                    if (!response.ok) {
                      const data = await response.json();
                      throw new Error(data.error || "Failed to add subscriber");
                    }

                    setFirstName("");
                    setLastName("");
                    setIsModalOpen(false);
                    fetchSubscribers();
                  } catch (error) {
                    setSubmitError(
                      error instanceof Error
                        ? error.message
                        : "Unable to add subscriber",
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-50"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-50"
                    required
                  />
                </div>
                {submitError && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {submitError}
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-black dark:bg-zinc-50 text-white dark:text-black rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? "Adding..." : "Add Subscriber"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
