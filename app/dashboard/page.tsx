import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const userId = await getSessionUserId();
  const [customers, professionals, services, appointments] = await Promise.all([
    prisma.customer.count(),
    prisma.professional.count({ where: { active: true } }),
    prisma.service.count({ where: { active: true } }),
    prisma.appointment.count({ where: { status: { in: ["SCHEDULED", "CONFIRMED"] } } }),
  ]);
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;

  return (
    <main><div className="container">
      <h1>Dashboard</h1>
      <p className="muted">{user ? `Olá, ${user.name}.` : "Modo demonstração — faça login para usar as operações protegidas."}</p>
      <section className="grid grid-4">
        <div className="card"><span className="muted">Clientes</span><div className="stat">{customers}</div></div>
        <div className="card"><span className="muted">Profissionais</span><div className="stat">{professionals}</div></div>
        <div className="card"><span className="muted">Serviços</span><div className="stat">{services}</div></div>
        <div className="card"><span className="muted">Agendamentos ativos</span><div className="stat">{appointments}</div></div>
      </section>
    </div></main>
  );
}
