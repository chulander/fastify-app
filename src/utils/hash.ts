import bcrypt from "bcrypt";

// ✅ Hash password before storing in the database
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Controls hashing complexity (recommended: 10-12)
  return bcrypt.hash(password, saltRounds);
}

// ✅ Compare a raw password with a hashed password (used for login)
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
