import { MongoClient, ObjectId } from 'mongodb';

// Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'hostelManagementSystem';

let client: MongoClient;
let db: any;

// Connect to MongoDB
export async function connectToDatabase() {
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
}

// Get MongoDB database instance
export async function getDb() {
  if (!db) {
    return await connectToDatabase();
  }
  return db;
}

// Helper to convert string IDs to ObjectId
export function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
}