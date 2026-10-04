"use client";

import { useState } from "react";
import { type AppointmentStatus } from "@/lib/demo-data";
import { useAgendaStore } from "@/lib/agenda-store";
import { formatDateTime, todayForDateInput } from "@/lib/format-date";
import FormDialog from "@/app/components/form-dialog";

const statusStyles: Record<AppointmentStatus, string> = {
  Agendado: "bg-amber-soft text-amber",
  Confirmado: "bg-mint text-forest",
  Concluído: "bg-paper text-muted",
  Cancelado: "bg-red-soft text-red",
};

export default function Agenda() {
  const { data, ready, addAppointment } = useAgendaStore();
  const { appointments, customers, professionals, services } = data;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "Todos">("Todos");
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const rows = appointments.flatMap((appointment) => {
    const customer = customers.find((item) => item.id === appointment.customerId);
    const service = services.find((item) => item.id === appointment.serviceId);
    const professional = professionals.find((item) => item.id === service?.professionalId);
    if (!customer || !service || !professional) return [];
    return [{ appointment, customer, service, professional }];
  }).filter(({ appointment, customer, service, professional }) => {
    const searchable = `${customer.name} ${service.name} ${professional.name}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (statusFilter === "Todos" || appointment.status === statusFilter);
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-sm font-semibold text-forest">ATENDIMENTOS</p><h1 className="text-3xl font-bold">Agenda</h1><p className="mt-2 text-muted">Acompanhe horários e status.</p></div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-mint px-3 py-1.5 text-sm font-semibold text-forest">{rows.length} resultados</span>
          <button type="button" disabled={!ready || customers.length === 0 || services.length === 0} onClick={() => setIsCreating(true)} className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50">Adicionar horário</button>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Buscar atendimento</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente, serviço ou profissional" className="w-full rounded-lg border border-line bg-white px-4 py-2.5 outline-none placeholder:text-muted focus:border-forest" />
        </label>
        <label>
          <span className="sr-only">Filtrar por status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AppointmentStatus | "Todos")} className="w-full rounded-lg border border-line bg-white px-4 py-2.5 sm:w-48">
            <option>Todos</option><option>Agendado</option><option>Confirmado</option><option>Concluído</option><option>Cancelado</option>
          </select>
        </label>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted"><tr>{["Data e hora", "Cliente", "Serviço", "Profissional", "Status"].map((heading) => <th key={heading} className="px-5 py-3 font-semibold">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ appointment, customer, service, professional }) => (
              <tr key={appointment.id} className="hover:bg-paper/70">
                <td className="whitespace-nowrap px-5 py-4 font-medium">{formatDateTime(appointment.startTime)}</td>
                <td className="px-5 py-4">{customer.name}</td><td className="px-5 py-4">{service.name}</td><td className="px-5 py-4">{professional.name}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[appointment.status]}`}>{appointment.status}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-muted">Nenhum agendamento encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      {isCreating && (
        <FormDialog title="Novo horário" onClose={() => { setIsCreating(false); setFormError(""); }}>
          <form className="space-y-4" onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const customerId = Number(form.get("customerId"));
            const serviceId = Number(form.get("serviceId"));
            const date = String(form.get("date"));
            const time = String(form.get("time"));
            const selectedService = services.find((service) => service.id === serviceId);
            if (!customers.some((customer) => customer.id === customerId) || !selectedService) {
              setFormError("Selecione um cliente e um serviço válidos.");
              return;
            }
            const start = new Date(`${date}T${time}`).getTime();
            const end = start + selectedService.durationMinutes * 60_000;
            const hasConflict = appointments.some((appointment) => {
              if (appointment.status === "Cancelado" || appointment.status === "Concluído") return false;
              const existingService = services.find((service) => service.id === appointment.serviceId);
              if (existingService?.professionalId !== selectedService.professionalId) return false;
              const existingStart = new Date(appointment.startTime).getTime();
              const existingEnd = existingStart + existingService.durationMinutes * 60_000;
              return start < existingEnd && end > existingStart;
            });
            if (hasConflict) {
              setFormError("Este profissional já tem um atendimento nesse horário.");
              return;
            }
            addAppointment({ customerId, serviceId, startTime: `${date}T${time}` });
            setIsCreating(false);
            setFormError("");
          }}>
            <label className="block space-y-2"><span className="text-sm font-semibold">Cliente</span><select name="customerId" required className="w-full rounded-lg border border-line px-3 py-2.5">{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
            <label className="block space-y-2"><span className="text-sm font-semibold">Serviço</span><select name="serviceId" required className="w-full rounded-lg border border-line px-3 py-2.5">{services.map((service) => <option key={service.id} value={service.id}>{service.name} · {service.durationMinutes} min</option>)}</select></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block space-y-2"><span className="text-sm font-semibold">Data</span><input type="date" name="date" defaultValue={todayForDateInput()} required className="w-full rounded-lg border border-line px-3 py-2.5" /></label><label className="block space-y-2"><span className="text-sm font-semibold">Horário</span><input type="time" name="time" defaultValue="09:00" required className="w-full rounded-lg border border-line px-3 py-2.5" /></label></div>
            {formError && <p role="alert" className="text-sm text-red">{formError}</p>}
            <button type="submit" className="w-full rounded-lg bg-forest px-4 py-3 font-semibold text-white hover:bg-forest-dark">Salvar horário</button>
          </form>
        </FormDialog>
      )}
    </main>
  );
}
