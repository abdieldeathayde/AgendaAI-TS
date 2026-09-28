import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
}
