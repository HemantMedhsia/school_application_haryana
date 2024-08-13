import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n MongoDB Connected...!!`);
    } catch (err) {
        console.log("MongoDB connection error", err);
        process.exit(1);
    }
};

export default connectDB;
