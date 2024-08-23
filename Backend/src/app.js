import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { schoolRoute } from "./Routes/school.Route.js";
import { studentRoute } from "./Routes/student.Route.js";
import { parentRoute } from "./Routes/parent.Route.js";

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

app.use('/api', schoolRoute);
app.use('/api', studentRoute);
app.use('/api', parentRoute);
export { app };
