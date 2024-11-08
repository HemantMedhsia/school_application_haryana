import jwt from "jsonwebtoken";
import connectDB from "../Db/db.js";

const dbConnections = {}; // Cache for storing active connections

const schoolDbMiddleware = async (req, res, next) => {
    try {
        const { schoolId } = req.params;
        console.log("schoolId", schoolId);

        // Check for a missing schoolId
        if (!schoolId) {
            return res.status(400).json({ message: "School ID is required." });
        }

        // Check if the connection for this schoolId is already established
        if (!dbConnections[schoolId]) {
            // Establish a new connection for this school and store it in cache
            dbConnections[schoolId] = await connectDB(schoolId);
        }

        // Attach the specific connection to the request object
        req.dbConnection = dbConnections[schoolId];

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default schoolDbMiddleware;
