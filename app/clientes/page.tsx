import { prisma } from "@/lib/prisma";

export default async function Clientes() {
  const customers = await prisma.customer.findMany({ orderBy: { name: "asc" }, include: { user: true } });
  return <main><div className="container">
    <h1>Clientes</h1>
    <div className="card table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th></tr></thead>
      <tbody>{customers.map(c => <tr key={c.id}><td>{c.name}</td><td>{c.user.email}</td><td>{c.phone || "—"}</td></tr>)}</tbody>
    </table></div>
  </div></main>;
}
