import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { schoolRoute } from "./Routes/school.Route.js";
import { studentRoute } from "./Routes/student.Route.js";
import { parentRoute } from "./Routes/parent.Route.js";
import { subjectRoute } from "./Routes/subject.Route.js";
import { adminRoute } from "./Routes/admin.Route.js";
import { teacherRoute } from "./Routes/teacher.Route.js";
import { teacherAttendenceRoute } from "./Routes/teacherAttendence.Route.js";
import bodyParser from "body-parser";
import { complaintRoute } from "./Routes/complaint.Route.js";
import { marksRoute } from "./Routes/marks.Route.js";
import { singleSubjectMarkRoute } from "./Routes/singleSubjectMark.Route.js";
import { staffRoute } from "./Routes/staff.Route.js";
import { noticeRoute } from "./Routes/notice.Route.js";
import { studentAttendenceRoute } from "./Routes/studentAttendence.Route.js";
import { staffAttendanceRoute } from "./Routes/staffAttendance.route.js";
import { classRoute } from "./Routes/class.Route.js";
import { sectionRoute } from "./Routes/section.Route.js";
import { sessionRoute } from "./Routes/session.Route.js";
import { studentHistoryRoute } from "./Routes/studentHistory.Route.js";
import { loginUserRouter } from "./Routes/loginUser.Route.js";
import { subjectGroupRoute } from "./Routes/subjectGroup.Route.js";
import { termRoute } from "./Routes/term.Route.js";
import { examTypeRoute } from "./Routes/examType.route.js";

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

app.get("/", (req, res) => {
    res.send("Welcome to our School. Deployment is complete");
});

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
app.use("/api", studentAttendenceRoute);
app.use("/api", staffAttendanceRoute);
app.use("/api", classRoute);
app.use("/api", sectionRoute);
app.use("/api", sessionRoute);
app.use("/api", sectionRoute);
app.use("/api", studentHistoryRoute);
app.use("/api", loginUserRouter);
app.use("/api",subjectGroupRoute)
app.use("/api",termRoute);
app.use("/api", examTypeRoute);

// Global error handling middleware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.status(statusCode).json(message);
});

export { app };
