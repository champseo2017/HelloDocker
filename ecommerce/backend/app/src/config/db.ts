import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://mongodb:27017/ecommerce', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
