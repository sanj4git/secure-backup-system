import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

import { uploadFile, restoreFile } from "../controllers/fileController.js";

const router = express.Router();

// Upload Backup File
router.post(
  "/upload",
  protect,
  authorize("USER", "ADMIN"),
  upload.single("file"),
  uploadFile
);

// Restore File
router.get("/restore/:id", protect, restoreFile);

export default router;