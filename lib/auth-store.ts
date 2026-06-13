import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcrypt";

const dataDirectory = path.join(process.cwd(), "data");
const usersFile = path.join(dataDirectory, "users.json");
const attemptsFile = path.join(dataDirectory, "login-attempts.json");

const SALT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 5 * 60 * 1000;

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type LoginAttempt = {
  email: string;
  failedAttempts: number;
  lockedUntil: number | null;
};

async function ensureDataDirectory() {
  await fs.mkdir(dataDirectory, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataDirectory();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string) {
  const users = await readJsonFile<StoredUser[]>(usersFile, []);
  const normalizedEmail = normalizeEmail(email);

  return users.find((user) => user.email === normalizedEmail) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const users = await readJsonFile<StoredUser[]>(usersFile, []);
  const normalizedEmail = normalizeEmail(input.email);
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeJsonFile(usersFile, users);

  return user;
}

export async function validateUserPassword(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  return isValidPassword ? user : null;
}

async function readAttempts() {
  return readJsonFile<LoginAttempt[]>(attemptsFile, []);
}

async function writeAttempts(attempts: LoginAttempt[]) {
  await writeJsonFile(attemptsFile, attempts);
}

export async function getLoginLock(email: string) {
  const attempts = await readAttempts();
  const normalizedEmail = normalizeEmail(email);
  const attempt = attempts.find((item) => item.email === normalizedEmail);

  if (!attempt?.lockedUntil) {
    return null;
  }

  if (attempt.lockedUntil <= Date.now()) {
    await clearLoginAttempts(normalizedEmail);
    return null;
  }

  return new Date(attempt.lockedUntil);
}

export async function registerFailedLogin(email: string) {
  const attempts = await readAttempts();
  const normalizedEmail = normalizeEmail(email);
  const attempt = attempts.find((item) => item.email === normalizedEmail);

  if (!attempt) {
    attempts.push({
      email: normalizedEmail,
      failedAttempts: 1,
      lockedUntil: null,
    });
    await writeAttempts(attempts);
    return;
  }

  attempt.failedAttempts += 1;

  if (attempt.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCK_TIME_MS;
  }

  await writeAttempts(attempts);
}

export async function clearLoginAttempts(email: string) {
  const attempts = await readAttempts();
  const normalizedEmail = normalizeEmail(email);
  const nextAttempts = attempts.filter((item) => item.email !== normalizedEmail);
  await writeAttempts(nextAttempts);
}
