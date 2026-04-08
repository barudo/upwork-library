import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidGenre, getGenreDisplayName } from "../../../lib/constants";

interface Book {
  _id: string;
  id: number;
  title: string;
  author: string;
  genre: string;
}

async function getBooksByGenre(genre: string): Promise<Book[]> {
  const res = await fetch(
    `http://localhost:3000/api/genres/${encodeURIComponent(genre)}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch books by genre");
  }
  return res.json();
}

interface PageProps {
  params: Promise<{ genre: string }>;
}

export default async function GenrePage({ params }: PageProps) {
  const { genre } = await params;

  // Validate genre
  if (!isValidGenre(genre)) {
    notFound();
  }

  const books = await getBooksByGenre(genre);

  if (books.length === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col py-32 px-16 bg-white dark:bg-black">
        <Link
          href="/books"
          className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white mb-8"
        >
          ← Back to Books
        </Link>
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-8">
          {getGenreDisplayName(genre)} Books
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              key={book._id}
              href={`/books/${book._id}`}
              className="block p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                {book.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-1">
                Author: {book.author}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Genre: {book.genre}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
