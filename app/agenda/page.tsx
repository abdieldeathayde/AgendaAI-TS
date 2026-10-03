import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Agenda() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { startTime: "asc" }, take: 50,
    include: { customer: true, service: { include: { professional: true } } }
  });
  return <main><div className="container">
    <h1>Agenda</h1>
    <div className="card table-wrap"><table><thead><tr><th>Data</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Status</th></tr></thead>
      <tbody>{appointments.map(a => <tr key={a.id}>
        <td>{new Date(a.startTime).toLocaleString("pt-BR")}</td><td>{a.customer.name}</td><td>{a.service.name}</td>
        <td>{a.service.professional.name}</td><td><span className="badge">{a.status}</span></td>
      </tr>)}</tbody></table></div>
  </div></main>;
}
