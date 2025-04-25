import { MongoClient } from 'mongodb';

// Connection details
const mongoUri = process.env.MONGODB_URI;
console.log('MongoDB URI detected:', mongoUri ? 'Yes' : 'No');

// Attempt connection with timeout
async function testConnection() {
  console.log('Starting MongoDB connection test...');
  
  // Validate URI
  if (!mongoUri) {
    console.error('ERROR: MONGODB_URI environment variable is not set!');
    return false;
  }
  
  // Create connection with timeout
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Connection attempt timed out after 5 seconds'));
    }, 5000);
  });
  
  try {
    // Try to connect with timeout
    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
      connectTimeoutMS: 5000,         // 5 seconds timeout for initial connection
      socketTimeoutMS: 5000           // 5 seconds timeout for operations
    });
    
    console.log('Attempting to connect...');
    
    // Race between connection and timeout
    await Promise.race([
      client.connect(),
      timeoutPromise
    ]);
    
    // If we get here, connection was successful
    clearTimeout(timeoutId);
    console.log('Successfully connected to MongoDB!');
    
    // Close connection
    await client.close();
    console.log('Connection closed properly');
    
    return true;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Connection error:', error.message);
    
    // Provide more specific feedback based on error
    if (error.message.includes('timed out')) {
      console.error('CONNECTIVITY ISSUE: The MongoDB server is not reachable.');
      console.error('This could be due to:');
      console.error('1. Network connectivity problems');
      console.error('2. Incorrect connection string');
      console.error('3. IP access restriction on MongoDB Atlas');
      console.error('4. Firewall or security group settings');
    } else if (error.message.includes('authentication failed')) {
      console.error('AUTHENTICATION ERROR: Invalid username or password in connection string');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('HOST ERROR: The hostname in the connection string cannot be resolved');
    }
    
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    console.log(`Connection test ${success ? 'PASSED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });