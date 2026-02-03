import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { getLogs } from "../controllers/logController.js";

const router = express.Router();

// Object: Audit Logs (ADMIN + AUDITOR)
router.get("/", protect, authorize("ADMIN", "AUDITOR"), getLogs);

export default router;