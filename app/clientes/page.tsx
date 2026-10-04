"use client";

import { useState } from "react";
import { useAgendaStore } from "@/lib/agenda-store";
import FormDialog from "@/app/components/form-dialog";

export default function Clientes() {
  const { data, ready, addCustomer } = useAgendaStore();
  const { customers } = data;
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-sm font-semibold text-forest">RELACIONAMENTO</p><h1 className="text-3xl font-bold">Clientes</h1><p className="mt-2 text-muted">Contatos da base de demonstração.</p></div>
        <div className="flex items-center gap-3"><span className="rounded-full bg-mint px-3 py-1.5 text-sm font-semibold text-forest">{filteredCustomers.length} clientes</span><button type="button" disabled={!ready} onClick={() => setIsCreating(true)} className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark disabled:opacity-50">Novo cliente</button></div>
      </div>
      <label className="mb-4 block max-w-md">
        <span className="sr-only">Buscar cliente</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, e-mail ou telefone" className="w-full rounded-lg border border-line bg-white px-4 py-2.5 outline-none placeholder:text-muted focus:border-forest" />
      </label>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted"><tr><th className="px-5 py-3 font-semibold">Nome</th><th className="px-5 py-3 font-semibold">E-mail</th><th className="px-5 py-3 font-semibold">Telefone</th></tr></thead>
          <tbody className="divide-y divide-line">
            {filteredCustomers.map((customer) => <tr key={customer.id} className="hover:bg-paper/70"><td className="px-5 py-4 font-semibold">{customer.name}</td><td className="px-5 py-4 text-muted">{customer.email}</td><td className="px-5 py-4">{customer.phone}</td></tr>)}
            {filteredCustomers.length === 0 && <tr><td colSpan={3} className="px-5 py-12 text-center text-muted">Nenhum cliente encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      {isCreating && (
        <FormDialog title="Novo cliente" onClose={() => { setIsCreating(false); setFormError(""); }}>
          <form className="space-y-4" onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const name = String(form.get("name")).trim();
            const email = String(form.get("email")).trim().toLowerCase();
            const phone = String(form.get("phone")).trim();
            if (customers.some((customer) => customer.email.toLowerCase() === email)) {
              setFormError("Já existe um cliente com este e-mail.");
              return;
            }
            addCustomer({ name, email, phone });
            setIsCreating(false);
            setFormError("");
          }}>
            <label className="block space-y-2"><span className="text-sm font-semibold">Nome</span><input name="name" required maxLength={100} className="w-full rounded-lg border border-line px-3 py-2.5" /></label>
            <label className="block space-y-2"><span className="text-sm font-semibold">E-mail</span><input type="email" name="email" required maxLength={160} className="w-full rounded-lg border border-line px-3 py-2.5" /></label>
            <label className="block space-y-2"><span className="text-sm font-semibold">Telefone</span><input type="tel" name="phone" required maxLength={30} className="w-full rounded-lg border border-line px-3 py-2.5" /></label>
            {formError && <p role="alert" className="text-sm text-red">{formError}</p>}
            <button type="submit" className="w-full rounded-lg bg-forest px-4 py-3 font-semibold text-white hover:bg-forest-dark">Salvar cliente</button>
          </form>
        </FormDialog>
      )}
    </main>
  );
}
