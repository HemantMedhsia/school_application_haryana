// import mongoose from "mongoose";
// import { DB_NAME } from "../constant.js";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         console.log(`\n MongoDB Connected...!!`);
//     } catch (err) {
//         console.log("MongoDB connection error", err);
//         process.exit(1);
//     }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async (schoolId) => {
    try {
        const dbName = `SchoolDatabase_${schoolId}`;
        const uri = `mongodb+srv://aradhyatech247:Hell0_2124@cluster0.so2se.mongodb.net/${dbName}?retryWrites=true&w=majority`;

        // Close any open connections
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }

        // Establish new connection
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 20000, // Increase timeout
            socketTimeoutMS: 45000,  // Increase timeout
        });

        console.log(`MongoDB Connected to ${dbName}...!!`);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

export default connectDB;
