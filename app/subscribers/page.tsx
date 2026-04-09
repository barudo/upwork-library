"use client";

import SubscribersContent from "@/components/SubscribersContent";

export default function SubscribersPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col py-32 px-16 bg-white dark:bg-black">
        <SubscribersContent />
      </main>
    </div>
  );
}
