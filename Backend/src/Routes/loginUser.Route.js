import express from "express";

const router = express.Router();

import { loginHandler, loginLimiter} from "../Controller/loginUser.Controller.js";

router.post("/login", loginLimiter, loginHandler);

export { router as loginUserRouter };
