import Link from "next/link";
import AddSubscriberButton from "@/components/AddSubscriberButton";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Library Management System
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Welcome to your digital library. Manage your books and subscribers
            efficiently.
          </p>
          <div className="flex gap-4">
            <Link
              href="/manage"
              className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Manage Library
            </Link>
            <Link
              href="/books"
              className="rounded-md border border-black px-4 py-2 text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              View Books
            </Link>
            <AddSubscriberButton />
          </div>
        </div>
      </main>
    </div>
  );
}
