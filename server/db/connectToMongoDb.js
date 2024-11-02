import mongoose from "mongoose";

const ConnectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error(
      "The error ouccured while connecting to the MongoDB is: ",
      error.message
    );
  }
};

export default ConnectToMongoDB;
