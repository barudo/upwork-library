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
                    $in: [
                      "$$bookId",
                      {
                        $ifNull: [
                          {
                            $map: {
                              input: { $ifNull: ["$loans", []] },
                              as: "loan",
                              in: "$$loan.bookId",
                            },
                          },
                          [],
                        ],
                      },
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
