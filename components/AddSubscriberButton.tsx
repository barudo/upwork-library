"use client";

import { useState } from "react";
import AddSubscriberModal from "./AddSubscriberModal";

export default function AddSubscriberButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscriberAdded = () => {
    // Since this is on homepage, maybe just close modal, or refresh if needed
    // For now, just close
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Add Subscriber
      </button>
      <AddSubscriberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubscriberAdded={handleSubscriberAdded}
      />
    </>
  );
}
