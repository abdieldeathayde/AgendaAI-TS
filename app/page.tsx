import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero container">
        <span className="badge">AgendaAI • Vercel Ready</span>
        <h1>Agendamentos simples, profissionais e escaláveis.</h1>
        <p>
          Plataforma de gestão de clientes, profissionais, serviços, disponibilidade e
          agendamentos, reconstruída em Next.js + TypeScript para facilitar o deploy.
        </p>
        <div className="actions">
          <Link className="btn" href="/dashboard">Abrir dashboard</Link>
          <Link className="btn secondary" href="/login">Entrar</Link>
        </div>
      </section>
      <section className="container grid grid-3">
        <div className="card"><h3>📅 Agenda</h3><p className="muted">Controle de horários e conflitos.</p></div>
        <div className="card"><h3>👥 Clientes</h3><p className="muted">Cadastro e histórico de atendimentos.</p></div>
        <div className="card"><h3>💼 Gestão</h3><p className="muted">Profissionais, serviços e indicadores.</p></div>
      </section>
    </main>
  );
}
