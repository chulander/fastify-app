import crypto from "crypto";

import { ENCRYPTION_KEY } from "./constants";
const IV_LENGTH = 16; // AES block size for GCM mode

if (!ENCRYPTION_KEY) {
  throw new Error("Missing ENCRYPTION_KEY in .env");
}

/**
 * 🔐 Encrypts text using AES-256-GCM
 */
export function encryptText(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex"); // Authentication tag for GCM mode
  return `${iv.toString("hex")}:${encrypted}:${authTag}`; // Store IV, encrypted text, and authTag
}

/**
 * 🔓 Decrypts text using AES-256-GCM
 */
export function decryptText(encryptedText: string): string {
  const [ivHex, encrypted, authTagHex] = encryptedText.split(":"); // Extract IV, ciphertext, and authTag
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  decipher.setAuthTag(authTag); // Set authentication tag
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
