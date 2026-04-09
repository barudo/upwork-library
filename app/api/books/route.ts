import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: Request) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "Database connection not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("upwork-library");
    const books = database.collection("books");

    let pipeline = [];

    if (query && query.trim()) {
      // Search in title, author, and genre
      const searchRegex = new RegExp(query.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { title: searchRegex },
            { author: searchRegex },
            { genre: searchRegex },
          ],
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: "subscribers",
        let: { bookId: "$_id" },
        pipeline: [{ $match: { $expr: { $in: ["$$bookId", "$loans"] } } }],
        as: "borrower",
      },
    });

    pipeline.push({
      $addFields: {
        borrower: { $ifNull: [{ $arrayElemAt: ["$borrower", 0] }, null] },
      },
    });

    const booksData = await books.aggregate(pipeline).toArray();

    return NextResponse.json(booksData);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "Database connection not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { title, author, genre } = body;

    if (!title || !author || !genre) {
      return NextResponse.json(
        { error: "Title, author, and genre are required" },
        { status: 400 },
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("upwork-library");
    const books = database.collection("books");

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
    };

    const result = await books.insertOne(newBook);

    await client.close();

    return NextResponse.json(
      { message: "Book added successfully", bookId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}
