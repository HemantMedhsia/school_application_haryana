import jwt from "jsonwebtoken";
import connectDB from "../Db/db.js";

const dbConnections = {}; // Cache for storing active connections

const schoolDbMiddleware = async (req, res, next) => {
    try {
        // Step 1: Extract Authorization header and token
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access token is missing" });
        }

        // Step 2: Verify the token and extract schoolCode
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                return res.status(403).json({ message: "Invalid access token" });
            } else if (error.name === "TokenExpiredError") {
                return res.status(403).json({ message: "Token expired" });
            } else {
                return res.status(500).json({ message: "Token verification error" });
            }
        }

        const { schoolCode } = decoded;

        if (!schoolCode) {
            return res.status(400).json({ message: "School code is missing in token" });
        }

        // Step 3: Establish a connection if not already established
        if (!dbConnections[schoolCode]) {
            console.log(`Establishing new connection for schoolCode: ${schoolCode}`);
            dbConnections[schoolCode] = await connectDB(schoolCode);
        }

        // Step 4: Attach the specific connection to the request object
        req.dbConnection = dbConnections[schoolCode];

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Database connection error or other error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default schoolDbMiddleware;
