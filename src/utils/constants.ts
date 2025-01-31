import dotenv from "dotenv";
dotenv.config();

const _allowedOrigins = process.env.ALLOWED_ORIGINS; // should be a comma delimited string
export const ALLOWED_ORIGINS = !_allowedOrigins ? [] : _allowedOrigins?.split(",").map((origin) => origin.trim());
export const DATABASE_URL = process.env.DATABASE_URL;
export const ENV = process.env.NODE_ENV || "development";
export const LOCALHOST_ORIGIN = "0.0.0.0";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
