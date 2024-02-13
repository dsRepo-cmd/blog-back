import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "");
    console.log(`Mongo server run on ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};

export default connectDB;
