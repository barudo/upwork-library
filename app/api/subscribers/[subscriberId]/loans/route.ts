import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

interface SubscriberLoan {
  bookId: ObjectId;
  loanedAt: Date;
}

interface SubscriberDoc {
  _id: ObjectId;
  loans?: SubscriberLoan[];
}

export async function POST(
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

  try {
    const body = await request.json();
    const { book } = body;

    const bookValue = Array.isArray(book) ? book[0] : book;
    if (!bookValue) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 },
      );
    }

    const subscriberObjectId = new ObjectId(subscriberId);
    const bookObjectId = new ObjectId(bookValue);

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("upwork-library");
    const subscribers = database.collection<SubscriberDoc>("subscribers");

    // Check current loan count
    const subscriber = await subscribers.findOne({ _id: subscriberObjectId });
    if (!subscriber) {
      await client.close();
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    const currentLoans = Array.isArray(subscriber.loans)
      ? subscriber.loans
      : [];
    if (currentLoans.length >= 3) {
      await client.close();
      return NextResponse.json(
        { error: "Subscriber already has the maximum of 3 books loaned" },
        { status: 400 },
      );
    }

    const result = await subscribers.updateOne(
      { _id: subscriberObjectId },
      {
        $push: {
          loans: {
            bookId: bookObjectId,
            loanedAt: new Date(),
          },
        },
      },
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Loan added to subscriber successfully",
        subscriberId: subscriberObjectId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Loan creation error:", error);
    return NextResponse.json(
      { error: "Failed to create loan" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

  try {
    const body = await request.json();
    const { book } = body;

    const bookValue = Array.isArray(book) ? book[0] : book;
    if (!bookValue) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 },
      );
    }

    const subscriberObjectId = new ObjectId(subscriberId);
    const bookObjectId = new ObjectId(bookValue);

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("upwork-library");
    const subscribers = database.collection<SubscriberDoc>("subscribers");

    const result = await subscribers.updateOne(
      { _id: subscriberObjectId },
      {
        $pull: {
          loans: { bookId: bookObjectId },
        },
      },
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Book returned successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Return book error:", error);
    return NextResponse.json(
      { error: "Failed to return book" },
      { status: 500 },
    );
  }
}
