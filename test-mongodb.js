import { MongoClient } from 'mongodb';

// Access MONGODB_URI from environment variables and display it for debugging
console.log("Available environment variables related to MongoDB:");
Object.keys(process.env).filter(key => key.includes("MONGO")).forEach(key => {
  console.log(`${key}: ${key === 'MONGODB_URI' ? '[URI EXISTS]' : '[OTHER MONGO VAR]'}`);
});

// Connection URL (default MongoDB URL if not provided)
const url = process.env.MONGODB_URI;
console.log("MongoDB URI detected:", url ? "[URI EXISTS]" : "[URI NOT FOUND]");

// Use environment URI or fallback
const connectionString = url || 'mongodb://localhost:27017';
const dbName = 'hostelManagementSystem';

async function testConnection() {
  console.log('Starting MongoDB connection test...');
  console.log(`Attempting to connect to: ${connectionString}`);
  
  try {
    const client = new MongoClient(connectionString);
    console.log('MongoClient created, attempting to connect...');
    
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    if (collections.length === 0) {
      console.log('No collections found (empty database)');
    } else {
      collections.forEach(collection => {
        console.log(` - ${collection.name}`);
      });
    }
    
    await client.close();
    console.log('Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(result => {
    console.log(`Connection test ${result ? 'passed' : 'failed'}`);
    process.exit(result ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  });