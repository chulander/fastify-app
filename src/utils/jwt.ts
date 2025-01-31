import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// 🔹 Access Token Claims
interface AccessTokenClaims {
  sub: string; // User ID
  role: string; // User role (e.g., "admin", "user")
  permissions?: string[]; // API permissions
  iat?: number;
  exp?: number;
}

// 🔹 ID Token Claims (OpenID Connect Standard)
interface IdTokenClaims {
  sub: string; // User ID
  email: string; // User email (OIDC spec)
  name?: string; // Optional user name
  iat?: number;
  exp?: number;
}

// ✅ Generates an `access_token` (Valid for 4 hours, includes role & permissions)
export function generateAccessToken(userId: string, role: string, permissions?: string[]) {
  const payload: AccessTokenClaims = { sub: userId, role, permissions };

  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "4h" });
}

// ✅ Generates an `id_token` (Valid for 4 hours, includes email)
export function generateIdToken(userId: string, email: string, name?: string) {
  const payload: IdTokenClaims = { sub: userId, email, name };

  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "4h" });
}

// ✅ Generates a `refresh_token` (Valid for 7 days, only contains `sub`)
export function generateRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// ✅ Verifies an Access Token
export function verifyAccessToken(token: string): AccessTokenClaims | null {
  try {
    return jwt.verify(token, TOKEN_SECRET) as AccessTokenClaims;
  } catch {
    return null;
  }
}

// ✅ Verifies an ID Token
export function verifyIdToken(token: string): IdTokenClaims | null {
  try {
    return jwt.verify(token, TOKEN_SECRET) as IdTokenClaims;
  } catch {
    return null;
  }
}

// ✅ Verifies a Refresh Token
export function verifyRefreshToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { sub: string };
  } catch {
    return null;
  }
}
