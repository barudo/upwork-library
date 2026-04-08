import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('upwork-library');
    const books = database.collection('books');

    const booksData = await books.find({}).toArray();

    return NextResponse.json(booksData);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  } finally {
    await client.close();
  }
}
