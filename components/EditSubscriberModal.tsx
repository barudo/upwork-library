"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface EditSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriberId: string;
  initialFirstName: string;
  initialLastName: string;
  onUpdated?: () => void;
}

export default function EditSubscriberModal({
  isOpen,
  onClose,
  subscriberId,
  initialFirstName,
  initialLastName,
  onUpdated,
}: EditSubscriberModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setError("");
  }, [isOpen, initialFirstName, initialLastName]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/subscribers/${subscriberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to update subscriber");
      }

      onClose();
      onUpdated?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update subscriber",
      );
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
              Edit Subscriber
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Update the subscriber details below.
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
              htmlFor="edit-first-name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              First Name
            </label>
            <input
              id="edit-first-name"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-zinc-50 dark:focus:ring-zinc-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-last-name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Last Name
            </label>
            <input
              id="edit-last-name"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-600 dark:bg-black dark:text-zinc-50 dark:focus:ring-zinc-50"
              required
            />
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
