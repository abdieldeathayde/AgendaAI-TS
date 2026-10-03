 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@agendaai.local");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) return setError(data?.error || "Não foi possível entrar. Tente novamente.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    }
  }

  return (
    <form className="card form" onSubmit={submit}>
      <div className="field"><label>E-mail</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <div className="field"><label>Senha</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      {error && <div className="error">{error}</div>}
      <button className="btn" type="submit">Entrar</button>
    </form>
  );
}
