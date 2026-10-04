"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { demoCredentials, startDemoSession } from "@/lib/demo-session";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@agendaai.local");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const session = startDemoSession(email, password);
    if (!session) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl place-items-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-sm sm:p-9">
        <p className="mb-2 text-sm font-semibold text-forest">ÁREA DE DEMONSTRAÇÃO</p>
        <h1 className="text-3xl font-bold">Entrar</h1>
        <p className="mt-2 text-sm leading-6 text-muted">A sessão é salva apenas neste navegador.</p>
        <form className="mt-7 space-y-5" onSubmit={submit}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold">E-mail</span>
            <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-line px-3.5 py-3 outline-none focus:border-forest focus:ring-2 focus:ring-mint" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Senha</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-lg border border-line px-3.5 py-3 outline-none focus:border-forest focus:ring-2 focus:ring-mint" />
          </label>
          {error && <p role="alert" className="text-sm font-medium text-red">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-forest px-4 py-3 font-semibold text-white hover:bg-forest-dark focus:outline-2 focus:outline-offset-2 focus:outline-forest">Entrar na demonstração</button>
        </form>
        <div className="mt-6 rounded-lg bg-paper p-4 text-sm">
          <p className="font-semibold">Acesso de demonstração</p>
          <p className="mt-2 text-muted">{demoCredentials.email}</p>
          <p className="text-muted">{demoCredentials.password}</p>
        </div>
      </section>
    </main>
  );
}
