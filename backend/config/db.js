const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_management';

    const conn = await mongoose.connect(mongoUri);

    console.log(`===============================================`);
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`🗄️  [Database Name]:    ${conn.connection.name}`);
    console.log(`🧭 [MongoDB Compass]:  Connect to "${mongoUri.split('/')[2]}" in Compass`);
    console.log(`===============================================`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.error(`\n-----------------------------------------------`);
    console.error(`💡 MONGODB COMPASS TROUBLESHOOTING GUIDE:`);
    console.error(`1. MongoDB Compass connects to the MongoDB Server on port 27017.`);
    console.error(`2. If you see 'ECONNREFUSED 127.0.0.1:27017':`);
    console.error(`   - Open Windows Services (services.msc) and ensure 'MongoDB Server' is Running.`);
    console.error(`   - Or start mongod in terminal: mongod --dbpath <data_folder>`);
    console.error(`   - In MongoDB Compass, verify the connection string is: mongodb://localhost:27017`);
    console.error(`-----------------------------------------------\n`);
    process.exit(1);
  }
};

module.exports = connectDB;
