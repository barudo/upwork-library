"use client";

import { useState } from "react";
import DeleteSubscriberModal from "@/components/DeleteSubscriberModal";

interface DeleteSubscriberButtonProps {
  subscriberId: string;
}

export default function DeleteSubscriberButton({
  subscriberId,
}: DeleteSubscriberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Delete subscriber"
        className="inline-flex cursor-pointer items-center justify-center rounded-md border border-red-300 p-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        🗑
      </button>
      <DeleteSubscriberModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        subscriberId={subscriberId}
      />
    </>
  );
}
