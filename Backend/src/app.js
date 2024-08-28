import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { schoolRoute } from "./Routes/school.Route.js";
import { studentRoute } from "./Routes/student.Route.js";
import { parentRoute } from "./Routes/parent.Route.js";
import noticeRoute from "./Routes/notice.Route.js";
import subjectRoute from "./Routes/subject.Route.js";
import { adminRoute } from "./Routes/admin.Route.js";
import { teacherRoute } from "./Routes/teacher.Route.js";
import { teacherAttendenceRoute } from "./Routes/teacherAttendence.Route.js";
import bodyParser from "body-parser";
import { complaintRoute } from "./Routes/complaint.Route.js";
import { marksRoute } from "./Routes/marks.Route.js";
import { singleSubjectMarkRoute } from "./Routes/singleSubjectMark.Route.js";
import { staffRoute } from "./Routes/staff.Route.js";

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

app.use(bodyParser.json());

app.use("/api", noticeRoute);
app.use("/api", subjectRoute);
app.use("/api", schoolRoute);
app.use("/api", studentRoute);
app.use("/api", parentRoute);
app.use("/api", adminRoute);
app.use("/api", teacherRoute);
app.use("/api", teacherAttendenceRoute);
app.use("/api", complaintRoute);
app.use("/api", marksRoute);
app.use("/api", singleSubjectMarkRoute);
app.use("/api", staffRoute);

// Global error handling middleware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.status(statusCode).json(message);
});

export { app };
