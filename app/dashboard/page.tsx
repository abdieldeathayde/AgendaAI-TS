"use client";

import Link from "next/link";
import { useAgendaStore } from "@/lib/agenda-store";
import { formatDateTime } from "@/lib/format-date";

export default function Dashboard() {
  const { data } = useAgendaStore();
  const { appointments, customers, professionals, services } = data;
  const activeAppointments = appointments.filter(
    (appointment) => appointment.status === "Agendado" || appointment.status === "Confirmado",
  );
  const upcoming = activeAppointments.slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-forest">PAINEL OPERACIONAL</p>
          <h1 className="text-3xl font-bold tracking-tight">Visão geral</h1>
          <p className="mt-2 text-muted">Acompanhe a operação do seu espaço.</p>
        </div>
        <Link href="/agenda" className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark">
          Ver agenda
        </Link>
      </div>

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Clientes", value: customers.length, note: "na base de demonstração" },
          { label: "Profissionais", value: professionals.length, note: "equipe cadastrada" },
          { label: "Serviços", value: services.length, note: "opções disponíveis" },
          { label: "Agendamentos ativos", value: activeAppointments.length, note: "próximos atendimentos" },
        ].map((metric) => (
          <article key={metric.label} className="rounded-xl border border-line bg-white p-5">
            <p className="text-sm font-medium text-muted">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold tabular-nums">{metric.value}</p>
            <p className="mt-1 text-xs text-muted">{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="font-bold">Próximos atendimentos</h2>
              <p className="mt-1 text-sm text-muted">Sua agenda em seguida</p>
            </div>
            <Link href="/agenda" className="text-sm font-semibold text-forest hover:underline">Agenda completa</Link>
          </div>
          <ul className="divide-y divide-line">
            {upcoming.map((appointment) => {
              const customer = customers.find((item) => item.id === appointment.customerId);
              const service = services.find((item) => item.id === appointment.serviceId);
              if (!customer || !service) return null;
              return (
                <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="mt-1 text-sm text-muted">{service.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatDateTime(appointment.startTime)}</p>
                    <p className="mt-1 text-xs text-muted">{appointment.status}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="font-bold">Acesso rápido</h2>
          <p className="mt-1 text-sm text-muted">Consulte os cadastros da demonstração.</p>
          <div className="mt-5 grid gap-2">
            {[
              ["Clientes", "/clientes", `${customers.length} cadastrados`],
              ["Profissionais", "/profissionais", `${professionals.length} na equipe`],
              ["Serviços", "/servicos", `${services.length} disponíveis`],
            ].map(([label, href, detail]) => (
              <Link key={href} href={href} className="flex items-center justify-between rounded-lg border border-line px-4 py-3 hover:bg-paper">
                <span className="font-semibold">{label}</span>
                <span className="text-sm text-muted">{detail}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
