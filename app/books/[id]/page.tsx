import Link from "next/link";
import { notFound } from "next/navigation";

interface Book {
  _id: string;
  id: number;
  title: string;
  author: string;
  genre: string;
}

async function getBook(id: string): Promise<Book | null> {
  const baseUrl = process.env.API_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/books`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }
  const books: Book[] = await res.json();
  return books.find((book) => book._id === id) || null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Link
          href="/manage?tab=books"
          className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white mb-8"
        >
          ← Back to Manage Library
        </Link>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {book.title}
          </h1>
          <div className="text-lg">
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">
              <strong>Genre:</strong> {book.genre}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              <strong>MongoDB ID:</strong> {book._id}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
