import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const algorithm = "aes-256-cbc";

// Generate AES key (32 bytes)
console.log("FILE_SECRET_KEY =", process.env.FILE_SECRET_KEY);
const key = crypto
  .createHash("sha256")
  .update(process.env.FILE_SECRET_KEY)
  .digest();

export const encryptFileBuffer = (buffer) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    encryptedData: encrypted.toString("base64"),
    iv: iv.toString("base64")
  };
};

export const decryptFileBuffer = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "base64")
  );

  let decrypted = decipher.update(
    Buffer.from(encryptedData, "base64")
  );

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
};