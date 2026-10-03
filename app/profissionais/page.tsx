import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Profissionais() {
  const professionals = await prisma.professional.findMany({ orderBy: { name: "asc" }, include: { services: true } });
  return <main><div className="container">
    <h1>Profissionais</h1>
    <section className="grid grid-3">{professionals.map(p => <div className="card" key={p.id}>
      <h3>{p.name}</h3><p className="muted">{p.specialty || "Profissional"}</p>
      <p>{p.bio || "Sem biografia."}</p><span className="badge">{p.services.length} serviço(s)</span>
    </div>)}</section>
  </div></main>;
}
