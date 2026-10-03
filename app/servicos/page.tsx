import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Servicos() {
  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" }, include: { professional: true } });
  return <main><div className="container">
    <h1>Serviços</h1>
    <div className="card table-wrap"><table><thead><tr><th>Serviço</th><th>Profissional</th><th>Duração</th><th>Preço</th></tr></thead>
      <tbody>{services.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.professional.name}</td><td>{s.durationMinutes} min</td><td>R$ {Number(s.price).toFixed(2).replace(".", ",")}</td></tr>)}</tbody>
    </table></div>
  </div></main>;
}
