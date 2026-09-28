import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AgendaAI",
  description: "Sistema de agendamento e gestão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="nav">
          <div className="container nav-inner">
            <Link href="/" className="brand">AgendaAI</Link>
            <nav className="nav-links">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/agenda">Agenda</Link>
              <Link href="/clientes">Clientes</Link>
              <Link href="/profissionais">Profissionais</Link>
              <Link href="/servicos">Serviços</Link>
              <Link href="/login">Entrar</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          AgendaAI • Next.js + TypeScript + Prisma + PostgreSQL
        </footer>
      </body>
    </html>
  );
}
