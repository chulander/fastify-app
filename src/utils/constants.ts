import dotenv from "dotenv";
dotenv.config();

const _allowedOrigins = process.env.ALLOWED_ORIGINS; // should be a comma delimited string
export const ALLOWED_ORIGINS = !_allowedOrigins ? [] : _allowedOrigins?.split(",").map((origin) => origin.trim());
export const DATABASE_URL = process.env.DATABASE_URL;
export const ENV = process.env.NODE_ENV || "development";
export const LOCALHOST_ORIGIN = "0.0.0.0";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
// TODO: this could be a function that returns the key to simulate a secret manager
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

export const TOKEN_SECRET = process.env.TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
