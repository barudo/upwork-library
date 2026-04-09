"use client";

import { useState } from "react";
import EditSubscriberModal from "@/components/EditSubscriberModal";

interface EditSubscriberButtonProps {
  subscriberId: string;
  firstName: string;
  lastName: string;
  onUpdated?: () => void;
}

export default function EditSubscriberButton({
  subscriberId,
  firstName,
  lastName,
  onUpdated,
}: EditSubscriberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Edit subscriber"
        className="inline-flex cursor-pointer items-center justify-center rounded-md border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-black dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      >
        ✎
      </button>
      <EditSubscriberModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        subscriberId={subscriberId}
        initialFirstName={firstName}
        initialLastName={lastName}
        onUpdated={onUpdated}
      />
    </>
  );
}
