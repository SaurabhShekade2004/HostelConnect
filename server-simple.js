import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());

// Get MongoDB URI from environment variables
const mongoUri = process.env.MONGODB_URI;
console.log('MongoDB URI available:', !!mongoUri);

// Simple endpoint to test basic functionality
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Test MongoDB connection
let dbClient = null;
async function connectToMongoDB() {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set!');
    }
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    const db = client.db('hostelManagementSystem');
    dbClient = client;
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// MongoDB test endpoint
app.get('/api/mongodb-test', async (req, res) => {
  try {
    if (!dbClient) {
      const { db } = await connectToMongoDB();
      
      // List collections
      const collections = await db.listCollections().toArray();
      return res.json({ 
        success: true, 
        message: 'MongoDB connection successful!',
        collections: collections.map(c => c.name)
      });
    } else {
      return res.json({ 
        success: true, 
        message: 'MongoDB already connected'
      });
    }
  } catch (error) {
    console.error('Error testing MongoDB:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'MongoDB connection failed',
      error: error.message
    });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
  
  // Try to connect to MongoDB at startup
  connectToMongoDB()
    .then(() => console.log('MongoDB connection initialized at startup'))
    .catch(err => console.error('Failed to initialize MongoDB at startup:', err));
});