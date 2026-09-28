import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const data = await prisma.appointment.findMany({
    orderBy: { startTime: "asc" },
    include: { customer: true, service: { include: { professional: true } } }
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });

  const body = await req.json();
  const customer = await prisma.customer.findUnique({ where: { id: Number(body.customerId) } });
  const service = await prisma.service.findUnique({ where: { id: Number(body.serviceId) }, include: { professional: true } });
  if (!customer || !service || !service.active || !service.professional.active) {
    return NextResponse.json({ error: "Cliente ou serviço inválido." }, { status: 400 });
  }

  const start = new Date(body.startTime);
  if (Number.isNaN(start.getTime()) || start <= new Date()) {
    return NextResponse.json({ error: "Informe um horário futuro válido." }, { status: 400 });
  }
  const end = new Date(start.getTime() + service.durationMinutes * 60000);

  const conflict = await prisma.appointment.findFirst({
    where: {
      service: { professionalId: service.professionalId },
      status: { in: ["SCHEDULED", "CONFIRMED"] },
      startTime: { lt: end },
      endTime: { gt: start }
    }
  });
  if (conflict) return NextResponse.json({ error: "O profissional já possui um agendamento nesse período." }, { status: 409 });

  const appointment = await prisma.appointment.create({
    data: { customerId: customer.id, serviceId: service.id, startTime: start, endTime: end, price: service.price, notes: body.notes || null }
  });
  return NextResponse.json(appointment, { status: 201 });
}
