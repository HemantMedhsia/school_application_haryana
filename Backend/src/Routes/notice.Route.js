import express from "express";
import {
    createNotice,
    deleteNotice,
    getAllNotices,
    getNoticeById,
    getNoticesByAudience,
    getNoticesByCategory,
    getNoticesForSchool,
    updateNotice,
} from "../Controller/notice.Controller.js";
import { authenticateToken } from "../Middlewares/authenticateToken.js";
const router = express.Router();

router.post("/create-notice/:schoolId", authenticateToken, createNotice);
router.get("/all-notice", getAllNotices);
router.get("/single-notice/:id", getNoticeById);
router.put("/notice-update/:id", updateNotice);
router.delete("/notice-delete/:id", deleteNotice);
router.get("/notice-audience/:audience", getNoticesByAudience);
router.get("/notice-category/:category", getNoticesByCategory);
router.get("/notice-school/:schoolId", getNoticesForSchool);

export { router as noticeRoute };
