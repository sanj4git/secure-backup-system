import crypto from "crypto";
import fs from "fs";

// Load RSA keys
const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");

// AES Encrypt File Buffer
export const encryptFileHybrid = (buffer) => {
  // Generate random AES key per file
  const aesKey = crypto.randomBytes(32);

  // IV
  const iv = crypto.randomBytes(16);

  // Encrypt file with AES
  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);

  let encrypted = cipher.update(buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Encrypt AES key using RSA public key (Key Exchange)
  const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);

  return {
    encryptedData: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    encryptedKey: encryptedKey.toString("base64")
  };
};

// AES Decrypt
export const decryptFileHybrid = (encryptedData, iv, encryptedKey) => {
  // Decrypt AES key with RSA private key
  const aesKey = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedKey, "base64")
  );

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    aesKey,
    Buffer.from(iv, "base64")
  );

  let decrypted = decipher.update(Buffer.from(encryptedData, "base64"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
};

// Hash File
export const computeHash = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

// Digital Signature
export const signHash = (hash) => {
  const signature = crypto.sign("sha256", Buffer.from(hash), privateKey);
  return signature.toString("base64");
};

// Verify Signature
export const verifySignature = (hash, signature) => {
  return crypto.verify(
    "sha256",
    Buffer.from(hash),
    publicKey,
    Buffer.from(signature, "base64")
  );
};