import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE = "agendaai_session";

function secret() {
  return process.env.AUTH_SECRET || "dev-only-change-me";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export async function createSession(userId: number) {
  const value = `${userId}.${Date.now()}`;
  const token = `${value}.${sign(value)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionUserId() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, issued, signature] = parts;
  const value = `${id}.${issued}`;
  if (sign(value) !== signature) return null;
  const issuedAt = Number(issued);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > 1000 * 60 * 60 * 24 * 7) return null;
  return Number(id);
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
