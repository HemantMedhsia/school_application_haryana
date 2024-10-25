import express from "express";
import {
    createFeesType,
    deleteFeesType,
    getAllFeesTypes,
    getFeesTypeById,
    updateFeesType,
} from "../Controller/feesType.Controller.js";

const router = express.Router();

router.post("/create-fees-type", createFeesType);
router.get("/get-all-fees-types", getAllFeesTypes);
router.get("/get-single-fees-type/:id", getFeesTypeById);
router.put("/update-fees-type/:id", updateFeesType);
router.delete("/delete-fees-type/:id", deleteFeesType);

export { router as feesTypeRouter };
