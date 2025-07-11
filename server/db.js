import { MongoClient, ObjectId } from 'mongodb';

// Connection URL
const url = process.env.MONGODB_URI;
console.log("MongoDB Connection: URI exists =", !!url);

if (!url) {
  console.error("ERROR: MONGODB_URI environment variable is not set!");
  console.error("Please set a valid MongoDB connection string as MONGODB_URI");
}

const dbName = 'hostelManagementSystem';

let db;
let client;

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    if (db) return db;
    
    client = new MongoClient(url);
    await client.connect();
    console.log('Database connection successful');
    
    db = client.db(dbName);
    
    // Create indexes for better query performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('applications').createIndex({ studentId: 1 });
    await db.collection('applications').createIndex({ cgpa: -1 }); // For sorting by CGPA
    await db.collection('allotments').createIndex({ studentId: 1 });
    await db.collection('complaints').createIndex({ status: 1 });
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Get MongoDB database instance
const getDb = async () => {
  if (!db) {
    return await connectToDatabase();
  }
  return db;
};

// Helper to convert string IDs to ObjectId
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export {
  connectToDatabase,
  getDb,
  ObjectId,
  toObjectId
};