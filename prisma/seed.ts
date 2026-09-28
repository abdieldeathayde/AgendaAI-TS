import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.service.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Administrador AgendaAI",
      email: "admin@agendaai.local",
      passwordHash: hashPassword("Admin@12345"),
      role: "ADMIN"
    }
  });

  const professionalNames = [
    ["Lucas Barbosa", "Barbeiro"],
    ["Amanda Silva", "Cabeleireira"],
    ["Rodrigo Santos", "Visagista"],
    ["Juliana Costa", "Esteticista"],
    ["Marcos Lima", "Terapeuta"]
  ];

  const professionals = [];
  for (let i = 0; i < professionalNames.length; i++) {
    const [name, specialty] = professionalNames[i];
    const email = `prof${i + 1}@agendaai.local`;
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashPassword("Demo@12345"), role: "PROFESSIONAL", phone: `(47) 9999-000${i}` }
    });
    const professional = await prisma.professional.create({
      data: { userId: user.id, name, specialty, bio: `Profissional de demonstração do AgendaAI — ${specialty}.` }
    });
    professionals.push(professional);
    for (let day = 0; day <= 5; day++) {
      await prisma.availability.create({ data: { professionalId: professional.id, dayOfWeek: day, startTime: "09:00", endTime: "18:00" } });
    }
  }

  const serviceNames = [
    ["Corte Masculino", 45, 35], ["Barba", 30, 25], ["Corte + Barba", 75, 55],
    ["Corte Feminino", 60, 80], ["Escova", 45, 50], ["Coloração", 120, 160],
    ["Visagismo", 60, 100], ["Design de Sobrancelhas", 30, 35], ["Limpeza de Pele", 60, 90],
    ["Massagem Relaxante", 60, 120], ["Hidratação", 45, 65], ["Platinado", 180, 250],
    ["Penteado", 90, 140], ["Barba Premium", 45, 45], ["Consultoria de Estilo", 60, 110]
  ];

  const services = [];
  for (let i = 0; i < serviceNames.length; i++) {
    const [name, duration, price] = serviceNames[i];
    const professional = professionals[i % professionals.length];
    services.push(await prisma.service.create({
      data: { professionalId: professional.id, name, durationMinutes: duration, price, description: `Serviço de demonstração: ${name}.` }
    }));
  }

  const customers = [];
  for (let i = 1; i <= 12; i++) {
    const name = ["Carlos Silva","Beatriz Souza","Fernando Lima","Mariana Alves","Rafael Oliveira","Camila Martins","João Pereira","Larissa Costa","Gustavo Rocha","Aline Mendes","Pedro Santos","Isabela Ramos"][i-1];
    const user = await prisma.user.create({
      data: { name, email: `cliente${i}@agendaai.local`, passwordHash: hashPassword("Demo@12345"), role: "CUSTOMER", phone: `(47) 98888-${String(1000+i)}` }
    });
    customers.push(await prisma.customer.create({ data: { userId: user.id, name, phone: user.phone } }));
  }

  const now = new Date();
  for (let i = 0; i < 18; i++) {
    const service = services[i % services.length];
    const customer = customers[i % customers.length];
    const dayOffset = i < 8 ? i + 1 : i - 7;
    const start = new Date(now);
    start.setDate(now.getDate() + dayOffset);
    start.setHours(9 + (i % 7), (i % 2) * 30, 0, 0);
    const end = new Date(start.getTime() + service.durationMinutes * 60000);
    await prisma.appointment.create({
      data: {
        customerId: customer.id,
        serviceId: service.id,
        startTime: start,
        endTime: end,
        status: i % 5 === 0 ? "CONFIRMED" : "SCHEDULED",
        price: service.price,
        notes: i % 3 === 0 ? "Cliente de demonstração." : null
      }
    });
  }

  console.log("AgendaAI seed concluído.");
  console.log("Admin: admin@agendaai.local / Admin@12345");
  console.log("Usuários demo: cliente1@agendaai.local até cliente12@agendaai.local / Demo@12345");
}

main().catch(console.error).finally(() => prisma.$disconnect());
