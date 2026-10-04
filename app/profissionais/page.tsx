"use client";

import { useState } from "react";
import { useAgendaStore } from "@/lib/agenda-store";
import FormDialog from "@/app/components/form-dialog";

export default function Profissionais() {
  const { data, ready, addProfessional } = useAgendaStore();
  const { professionals, services } = data;
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-semibold text-forest">EQUIPE</p><h1 className="text-3xl font-bold">Profissionais</h1><p className="mt-2 text-muted">Especialidades e serviços da equipe.</p></div><button type="button" disabled={!ready} onClick={() => setIsCreating(true)} className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-50">Novo profissional</button></div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {professionals.map((professional) => {
          const professionalServices = services.filter((service) => service.professionalId === professional.id);
          return (
            <article key={professional.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div><h2 className="text-lg font-bold">{professional.name}</h2><p className="mt-1 text-sm font-medium text-forest">{professional.specialty}</p></div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mint text-sm font-bold text-forest">{professional.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{professional.bio}</p>
              <div className="mt-5 border-t border-line pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Serviços</p><ul className="mt-2 space-y-2">{professionalServices.map((service) => <li key={service.id} className="flex justify-between gap-3 text-sm"><span>{service.name}</span><span className="whitespace-nowrap text-muted">R$ {service.price.toFixed(2).replace(".", ",")}</span></li>)}</ul></div>
            </article>
          );
        })}
      </section>
      {isCreating && (
        <FormDialog title="Novo profissional" onClose={() => { setIsCreating(false); setFormError(""); }}>
          <form className="space-y-4" onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const name = String(form.get("name")).trim();
            const specialty = String(form.get("specialty")).trim();
            const bio = String(form.get("bio")).trim();
            if (professionals.some((professional) => professional.name.toLowerCase() === name.toLowerCase())) {
              setFormError("Já existe um profissional com este nome.");
              return;
            }
            addProfessional({ name, specialty, bio });
            setIsCreating(false);
            setFormError("");
          }}>
            <label className="block space-y-2"><span className="text-sm font-semibold">Nome</span><input name="name" required maxLength={100} className="w-full rounded-lg border border-line px-3 py-2.5" /></label>
            <label className="block space-y-2"><span className="text-sm font-semibold">Especialidade</span><input name="specialty" required maxLength={80} className="w-full rounded-lg border border-line px-3 py-2.5" /></label>
            <label className="block space-y-2"><span className="text-sm font-semibold">Apresentação</span><textarea name="bio" required maxLength={400} rows={4} className="w-full resize-y rounded-lg border border-line px-3 py-2.5" /></label>
            {formError && <p role="alert" className="text-sm text-red">{formError}</p>}
            <button type="submit" className="w-full rounded-lg bg-forest px-4 py-3 font-semibold text-white hover:bg-forest-dark">Salvar profissional</button>
          </form>
        </FormDialog>
      )}
    </main>
  );
}
