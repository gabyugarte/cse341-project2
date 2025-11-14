const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let database = null;

const initDb = async (callback) => {
  if (database) {
    console.log('Database is already initialized.');
    return callback(null, database);
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URL);
    await client.connect();

 
    database = client.db();

    console.log(' MongoDB connected successfully!');
    callback(null, database);
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    callback(error);
  }
};

const getDatabase = () => {
  if (!database) throw Error('Database not initialized.');
  return database;
};

module.exports = { initDb, getDatabase };
