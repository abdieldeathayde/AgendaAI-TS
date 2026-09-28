import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.professional.findMany({ include: { services: true, availabilities: true }, orderBy: { name: "asc" } });
  return NextResponse.json(data);
}
