import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

import {
  uploadFile,
  restoreFile,
  getMyFiles,
  getAllFilesAdmin
} from "../controllers/fileController.js";

const router = express.Router();

// ==============================
// USER ROUTES
// ==============================

// Upload Backup File
router.post(
  "/upload",
  protect,
  authorize("USER", "ADMIN"),
  upload.single("file"),
  uploadFile
);

// List My Files (USER Dashboard)
router.get("/myfiles", protect, authorize("USER", "ADMIN"), getMyFiles);

// Restore File
router.get("/restore/:id", protect, restoreFile);

// ==============================
// ADMIN ROUTES
// ==============================

// Admin View All Files Metadata
router.get("/all", protect, authorize("ADMIN"), getAllFilesAdmin);

export default router;