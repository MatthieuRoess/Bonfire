import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect('YOUR_URI',{dbName: 'Project_IRC'});
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Error disconnecting from MongoDB Atlas:', error);
  }
}
