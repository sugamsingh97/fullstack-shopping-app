import mongoose from 'mongoose';

// this function is called in server.js to connect to mongodb
const connectToMongoDB = async () => {
  try {
    // connecting to mongodb
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log('Error with db connection', error.message);
  }
};
export default connectToMongoDB;
