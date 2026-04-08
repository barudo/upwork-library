require("dotenv").config({ path: ".env_local" });
const { MongoClient } = require("mongodb");

async function runMigration() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found in .env_local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("upwork-library");
    const books = database.collection("books");

    // Sample data
    const sampleBooks = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
      },
      {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Fiction",
      },
    ];

    const result = await books.insertMany(sampleBooks);
    console.log(`${result.insertedCount} books inserted`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

runMigration();
