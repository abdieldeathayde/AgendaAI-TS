import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.customer.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.email) return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });
  const { hashPassword } = await import("@/lib/password");
  const user = await prisma.user.create({
    data: {
      name: body.name, email: body.email.toLowerCase(), phone: body.phone || null,
      passwordHash: hashPassword(body.password || "Demo@12345"),
      role: "CUSTOMER", customer: { create: { name: body.name, phone: body.phone || null } }
    },
    include: { customer: true }
  });
  return NextResponse.json(user.customer, { status: 201 });
}
