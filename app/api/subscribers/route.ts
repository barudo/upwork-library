import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
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
    const subscribers = database.collection("subscribers");

    const subscribersData = await subscribers.find({}).toArray();
    return NextResponse.json(subscribersData);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
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
    const { firstName, lastName } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 },
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("upwork-library");
    const subscribers = database.collection("subscribers");

    const newSubscriber = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    const result = await subscribers.insertOne(newSubscriber);

    await client.close();

    return NextResponse.json(
      {
        message: "Subscriber added successfully",
        subscriberId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to add subscriber" },
      { status: 500 },
    );
  }
}
