import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("email" in body) || !("password" in body)) {
    return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
  }

  const { email, password } = body;
  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
    return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    console.error("Login request failed:", error);
    return NextResponse.json(
      { error: "Falha ao autenticar. Verifique a configuração do banco e do AUTH_SECRET." },
      { status: 500 }
    );
  }
}
