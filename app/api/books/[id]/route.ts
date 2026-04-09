import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "Database connection not configured" },
      { status: 500 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Book ID is required" },
      { status: 400 },
    );
  }

  let bookObjectId: ObjectId;
  try {
    bookObjectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("upwork-library");
    const books = database.collection("books");

    const [book] = await books
      .aggregate([
        { $match: { _id: bookObjectId } },
        {
          $lookup: {
            from: "subscribers",
            let: { bookId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: {
                              $cond: [{ $isArray: "$loans" }, "$loans", []],
                            },
                            as: "loan",
                            cond: { $eq: ["$$loan.bookId", "$$bookId"] },
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  id: 1,
                  firstName: 1,
                  lastName: 1,
                },
              },
            ],
            as: "loanedTo",
          },
        },
      ])
      .toArray();

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const normalizedBook = {
      ...book,
      _id: book._id instanceof ObjectId ? book._id.toString() : book._id,
      loanedTo: Array.isArray(book.loanedTo)
        ? book.loanedTo.map((subscriber: { _id?: ObjectId }) => ({
            ...subscriber,
            _id:
              subscriber._id instanceof ObjectId
                ? subscriber._id.toString()
                : subscriber._id,
          }))
        : book.loanedTo,
    };

    return NextResponse.json(normalizedBook);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "Database connection not configured" },
      { status: 500 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Book ID is required" },
      { status: 400 },
    );
  }

  let bookObjectId: ObjectId;
  try {
    bookObjectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
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

    const result = await books.updateOne(
      { _id: bookObjectId },
      {
        $set: {
          title: String(title).trim(),
          author: String(author).trim(),
          genre: String(genre).trim(),
        },
      },
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "Database connection not configured" },
      { status: 500 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Book ID is required" },
      { status: 400 },
    );
  }

  let bookObjectId: ObjectId;
  try {
    bookObjectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("upwork-library");
    const subscribers = database.collection("subscribers");

    const hasLoan = await subscribers.findOne({
      loans: { $elemMatch: { bookId: bookObjectId } },
    });

    if (hasLoan) {
      return NextResponse.json(
        { error: "Book is currently loaned and cannot be deleted" },
        { status: 400 },
      );
    }

    const books = database.collection("books");
    const result = await books.deleteOne({ _id: bookObjectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}
