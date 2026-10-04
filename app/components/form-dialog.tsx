"use client";

import { useEffect, type ReactNode } from "react";

export default function FormDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label={title} className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-wide text-forest">NOVO CADASTRO</p><h2 className="mt-1 text-2xl font-bold">{title}</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar formulário" className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted hover:bg-paper">Fechar</button>
        </div>
        {children}
      </section>
    </div>
  );
}