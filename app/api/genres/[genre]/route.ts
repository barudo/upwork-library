import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ genre: string }> },
) {
  const { genre } = await params;
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json(
      { error: "Database connection not configured" },
      { status: 500 },
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("upwork-library");
    const books = database.collection("books");

    // Find books that match the genre (case-insensitive)
    const booksByGenre = await books
      .find({
        genre: { $regex: new RegExp(`^${genre}$`, "i") },
      })
      .toArray();

    return NextResponse.json(booksByGenre);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books by genre" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}
