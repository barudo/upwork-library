import Link from "next/link";
import { notFound } from "next/navigation";
import LoanedToList from "@/components/LoanedToList";
import LoanBookButton from "@/components/LoanBookButton";

interface Book {
  _id: string;
  id: number;
  title: string;
  author: string;
  genre: string;
  loanedTo?: Array<{
    _id?: string;
    id?: number;
    firstName?: unknown;
    lastName?: unknown;
  }>;
}

async function getBook(id: string): Promise<Book | null> {
  const baseUrl = process.env.API_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/books/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch book");
  }
  const book: Book = await res.json();
  return book;
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

  const rawLoanedTo = (book as Book & { loanedTo?: unknown }).loanedTo;
  const loanedTo =
    Array.isArray(rawLoanedTo) && rawLoanedTo.length > 0
      ? rawLoanedTo
      : rawLoanedTo
        ? [rawLoanedTo]
        : [];
  const normalizeId = (value: unknown) =>
    typeof value === "string" ? value : JSON.stringify(value) ?? String(value);
  const loanedToItems = loanedTo
    .map((subscriber) => {
      const rawId =
        typeof subscriber._id === "string"
          ? subscriber._id
          : typeof subscriber.id === "number"
            ? String(subscriber.id)
            : subscriber._id ?? subscriber.id;
      const idText = normalizeId(rawId);
      const firstName =
        typeof subscriber.firstName === "string" ? subscriber.firstName : "";
      const lastName =
        typeof subscriber.lastName === "string" ? subscriber.lastName : "";
      const fullName = [firstName, lastName].filter(Boolean).join(" ");

      return idText ? { id: idText, fullName } : null;
    })
    .filter(
      (item): item is { id: string; fullName: string } =>
        Boolean(item?.id && item.fullName),
    );
  const bookIdText = normalizeId(book._id);

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
              <strong>MongoDB ID:</strong> {bookIdText}
            </p>
          </div>
          <div className="text-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                Loaned To
              </h2>
              <LoanBookButton bookId={id} />
            </div>
            <LoanedToList bookId={id} subscribers={loanedToItems} />
          </div>
        </div>
      </main>
    </div>
  );
}
