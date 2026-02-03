import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    // Owner of the file (USER)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // File metadata
    filename: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    // 🔒 Encrypted file content (AES)
    encryptedData: {
      type: String,
      required: true
    },

    // AES IV
    iv: {
      type: String,
      required: true
    },

    // 🔑 Hybrid Encryption Component
    // AES key encrypted using RSA public key
    encryptedKey: {
      type: String,
      required: true
    },

    // ✅ Integrity Component
    // SHA-256 hash of encrypted file
    fileHash: {
      type: String,
      required: true
    },

    // ✅ Digital Signature Component
    // RSA signature of hash
    signature: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);