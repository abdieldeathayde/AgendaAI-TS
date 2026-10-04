"use client";

import { useState } from "react";
import { useAgendaStore } from "@/lib/agenda-store";
import FormDialog from "@/app/components/form-dialog";

export default function Servicos() {
  const { data, ready, addService } = useAgendaStore();
  const { professionals, services } = data;
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-semibold text-forest">CATÁLOGO</p><h1 className="text-3xl font-bold">Serviços</h1><p className="mt-2 text-muted">Procedimentos e valores da demonstração.</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-mint px-3 py-1.5 text-sm font-semibold text-forest">{services.length} serviços</span><button type="button" disabled={!ready || professionals.length === 0} onClick={() => setIsCreating(true)} className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-50">Novo serviço</button></div></div>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted"><tr><th className="px-5 py-3 font-semibold">Serviço</th><th className="px-5 py-3 font-semibold">Profissional</th><th className="px-5 py-3 font-semibold">Duração</th><th className="px-5 py-3 text-right font-semibold">Preço</th></tr></thead>
          <tbody className="divide-y divide-line">
            {services.map((service) => {
              const professional = professionals.find((item) => item.id === service.professionalId);
              return <tr key={service.id} className="hover:bg-paper/70"><td className="px-5 py-4"><p className="font-semibold">{service.name}</p><p className="mt-1 text-xs text-muted">{service.description}</p></td><td className="px-5 py-4">{professional?.name ?? "Equipe"}</td><td className="whitespace-nowrap px-5 py-4">{service.durationMinutes} min</td><td className="whitespace-nowrap px-5 py-4 text-right font-semibold">R$ {service.price.toFixed(2).replace(".", ",")}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
      {isCreating && (
        <FormDialog title="Novo serviço" onClose={() => { setIsCreating(false); setFormError(""); }}>
          <form className="space-y-4" onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const name = String(form.get("name")).trim();
            const description = String(form.get("description")).trim();
            const professionalId = Number(form.get("professionalId"));
            const durationMinutes = Number(form.get("durationMinutes"));
            const price = Number(String(form.get("price")).replace(",", "."));
            if (!professionals.some((professional) => professional.id === professionalId) || !Number.isInteger(durationMinutes) || durationMinutes < 1 || !Number.isFinite(price) || price < 0) {
              setFormError("Confira profissional, duração e preço.");
              return;
            }
            if (services.some((service) => service.professionalId === professionalId && service.name.toLowerCase() === name.toLowerCase())) {
              setFormError("Este profissional já possui um serviço com esse nome.");
              return;
            }
            addService({ name, description, professionalId, durationMinutes, price });
            setIsCreating(false);
            setFormError("");
          }}>
            <label className="block space-y-2"><span className="text-sm font-semibold">Nome do serviço</span><input name="name" required maxLength={100} className="w-full rounded-lg border border-line px-3 py-2.5" /></label>
            <label className="block space-y-2"><span className="text-sm font-semibold">Profissional</span><select name="professionalId" required className="w-full rounded-lg border border-line px-3 py-2.5">{professionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.name} · {professional.specialty}</option>)}</select></label>
            <label className="block space-y-2"><span className="text-sm font-semibold">Descrição</span><textarea name="description" required maxLength={300} rows={3} className="w-full resize-y rounded-lg border border-line px-3 py-2.5" /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block space-y-2"><span className="text-sm font-semibold">Duração (min)</span><input type="number" name="durationMinutes" min={1} step={1} required className="w-full rounded-lg border border-line px-3 py-2.5" /></label><label className="block space-y-2"><span className="text-sm font-semibold">Preço (R$)</span><input type="number" name="price" min={0} step="0.01" required className="w-full rounded-lg border border-line px-3 py-2.5" /></label></div>
            {formError && <p role="alert" className="text-sm text-red">{formError}</p>}
            <button type="submit" className="w-full rounded-lg bg-forest px-4 py-3 font-semibold text-white hover:bg-forest-dark">Salvar serviço</button>
          </form>
        </FormDialog>
      )}
    </main>
  );
}
