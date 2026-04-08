import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subscriberId: string }> },
) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json(
      { error: "Database connection not configured" },
      { status: 500 },
    );
  }

  const { subscriberId } = await params;
  if (!subscriberId) {
    return NextResponse.json(
      { error: "Subscriber ID is required" },
      { status: 400 },
    );
  }

  let subscriberObjectId: ObjectId;
  try {
    subscriberObjectId = new ObjectId(subscriberId);
  } catch {
    return NextResponse.json(
      { error: "Invalid subscriber ID" },
      { status: 400 },
    );
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("upwork-library");
    const subscribers = database.collection("subscribers");

    const subscriber = await subscribers.findOne({ _id: subscriberObjectId });
    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    const loans = Array.isArray(subscriber.loans) ? subscriber.loans : [];
    const bookIds = loans
      .map((loan) => loan.bookId)
      .filter((id) => id instanceof ObjectId);

    const books =
      bookIds.length > 0
        ? await database
            .collection("books")
            .find({ _id: { $in: bookIds } })
            .toArray()
        : [];

    const bookMap = new Map(books.map((book) => [book._id.toString(), book]));
    const loansWithBooks = loans.map((loan) => ({
      ...loan,
      bookObject: bookMap.get(loan.bookId.toString()) || null,
    }));

    return NextResponse.json({
      ...subscriber,
      loans: loansWithBooks,
    });
  } catch (error) {
    console.error("Subscriber fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriber" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}
