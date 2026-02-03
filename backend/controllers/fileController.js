import File from "../models/File.js";
import Log from "../models/Log.js";

import {
  encryptFileHybrid,
  decryptFileHybrid,
  computeHash,
  signHash,
  verifySignature
} from "../utils/cryptoSystem.js";

// ==============================
// UPLOAD FILE (Hybrid Encryption + Signature)
// ==============================

export const uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ msg: "No file uploaded" });

    // 1. Encrypt file using AES + RSA key wrapping
    const { encryptedData, iv, encryptedKey } = encryptFileHybrid(
      req.file.buffer
    );

    // 2. Compute hash of encrypted file
    const fileHash = computeHash(encryptedData);

    // 3. Digitally sign the hash
    const signature = signHash(fileHash);

    // 4. Store everything in MongoDB
    const fileDoc = await File.create({
      ownerId: req.user._id,
      filename: req.file.originalname,
      fileType: req.file.mimetype,

      encryptedData,
      iv,
      encryptedKey,

      fileHash,
      signature
    });

    // 5. Log upload action
    await Log.create({
      userId: req.user._id,
      action: `Uploaded securely: ${req.file.originalname}`
    });

    res.status(201).json({
      msg: "File uploaded with Hybrid Encryption + Digital Signature",
      fileId: fileDoc._id
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ==============================
// RESTORE FILE (Verify Integrity + Decrypt)
// ==============================

export const restoreFile = async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id);

    if (!fileDoc)
      return res.status(404).json({ msg: "File not found" });

    // ACL Enforcement: USER can restore only own file
    if (
      req.user.role === "USER" &&
      fileDoc.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // 1. Verify Hash Integrity
    const currentHash = computeHash(fileDoc.encryptedData);

    // 2. Verify Digital Signature
    const valid = verifySignature(currentHash, fileDoc.signature);

    if (!valid) {
      return res.status(400).json({
        msg: "File integrity compromised! Signature invalid."
      });
    }

    // 3. Decrypt file using Hybrid Decryption
    const decryptedBuffer = decryptFileHybrid(
      fileDoc.encryptedData,
      fileDoc.iv,
      fileDoc.encryptedKey
    );

    // 4. Log restore action
    await Log.create({
      userId: req.user._id,
      action: `Restored securely: ${fileDoc.filename}`
    });

    // 5. Send file as download
    res.set({
      "Content-Type": fileDoc.fileType,
      "Content-Disposition": `attachment; filename="${fileDoc.filename}"`
    });

    res.send(decryptedBuffer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};