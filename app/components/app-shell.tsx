"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { endDemoSession, getDemoSession, onDemoSessionChange, type DemoSession } from "@/lib/demo-session";
import { useAgendaStore } from "@/lib/agenda-store";

const navigation = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/agenda", label: "Agenda" },
  { href: "/clientes", label: "Clientes" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/servicos", label: "Serviços" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { downloadSpreadsheet, importSpreadsheet, spreadsheetStatus } = useAgendaStore();
  const [session, setSession] = useState<DemoSession | null>(null);
  const [spreadsheetError, setSpreadsheetError] = useState("");

  useEffect(() => {
    setSession(getDemoSession());
    return onDemoSessionChange(() => setSession(getDemoSession()));
  }, []);

  function signOut() {
    endDemoSession();
    setSession(null);
    router.push("/login");
  }

  async function handleSpreadsheetImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!window.confirm("Importar esta planilha substituirá os dados atuais deste navegador. Deseja continuar?")) {
      event.target.value = "";
      return;
    }
    try {
      await importSpreadsheet(file);
      setSpreadsheetError("");
    } catch (error) {
      setSpreadsheetError(error instanceof Error ? error.message : "Não foi possível importar a planilha.");
    }
    event.target.value = "";
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/" className="flex w-fit items-center gap-3" aria-label="AgendaAI início">
            <span className="grid size-10 place-items-center rounded-xl bg-forest text-lg font-black text-white">A</span>
            <span>
              <span className="block text-lg font-bold leading-tight">AgendaAI</span>
              <span className="block text-xs text-muted">GESTÃO DE ATENDIMENTOS</span>
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="flex gap-1 overflow-x-auto pb-1 lg:pb-0">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${active ? "bg-mint text-forest" : "text-muted hover:bg-paper hover:text-ink"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-bold tracking-wide text-muted">DEMO</span>
            <button onClick={() => void downloadSpreadsheet()} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:bg-paper">
              Baixar Excel
            </button>
            <label className="cursor-pointer rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:bg-paper">
              Importar Excel
              <input type="file" accept=".xlsx" onChange={(event) => void handleSpreadsheetImport(event)} className="sr-only" />
            </label>
            {session ? (
              <>
                <span className="hidden max-w-40 truncate text-sm font-medium sm:block">{session.name}</span>
                <button onClick={signOut} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:bg-paper">
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-white hover:bg-forest-dark">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-line bg-white px-4 py-5 text-center text-xs text-muted">
        <span aria-live="polite">{spreadsheetError || spreadsheetStatus}</span>
      </footer>
    </div>
  );
}