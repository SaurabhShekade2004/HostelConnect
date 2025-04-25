// Simple script to print all available environment variables
console.log('All environment variables:');
for (const key in process.env) {
  // Hide secret values, just show the key with a placeholder
  const value = key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD') || 
               key.includes('TOKEN') || key.includes('URI') ? '[VALUE HIDDEN]' : process.env[key];
  console.log(`${key}=${value}`);
}

// Specifically log MONGODB related keys
console.log('\nMONGODB related variables:');
const mongoVars = Object.keys(process.env).filter(k => k.includes('MONGO'));
if (mongoVars.length === 0) {
  console.log('No MongoDB related variables found');
} else {
  mongoVars.forEach(key => {
    console.log(`${key} exists: ${process.env[key] ? 'yes' : 'no'}`);
  });
}