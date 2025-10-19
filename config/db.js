const { MongoClient } = require("mongodb");

// const url = "mongodb://127.0.0.1:27017"; // local MongoDB

const url="mongodb+srv://ko2097455_db_user:GiDTNJ9eU4MMz8YE@cluster0.jhkeded.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dbName = "chatAppDB";

// const conn=process.env.MONGO_URI;

let db = null;

const connectDB = async () => {
  if (db) return db;
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
  console.log("✅ MongoDB connected");
  return db;
};

module.exports = connectDB;