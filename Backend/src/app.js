import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import noticeRoute from "./Routes/notice.Route.js";
import subjectRoute from "./Routes/subject.Route.js";


const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieParser());



app.use("/api",noticeRoute);
app.use("/api",subjectRoute);



// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error (optional)
    res.status(500).json({ error: "An internal server error occurred" });
});

export { app };
