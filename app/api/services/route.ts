import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.service.findMany({ include: { professional: true }, orderBy: { name: "asc" } });
  return NextResponse.json(data);
}
