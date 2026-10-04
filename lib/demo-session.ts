export type DemoSession = {
  name: string;
  email: string;
  role: "ADMIN";
};

const sessionKey = "agendaai-demo-session";
const sessionChangedEvent = "agendaai:session-changed";

export const demoCredentials = {
  email: "admin@agendaai.local",
  password: "Admin@12345",
};

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;

  try {
    const session: unknown = JSON.parse(localStorage.getItem(sessionKey) ?? "null");
    if (
      session &&
      typeof session === "object" &&
      "name" in session &&
      "email" in session &&
      "role" in session &&
      session.role === "ADMIN" &&
      typeof session.name === "string" &&
      typeof session.email === "string"
    ) {
      return { name: session.name, email: session.email, role: "ADMIN" };
    }
  } catch {
    localStorage.removeItem(sessionKey);
  }

  return null;
}

export function startDemoSession(email: string, password: string): DemoSession | null {
  if (
    email.trim().toLowerCase() !== demoCredentials.email ||
    password !== demoCredentials.password
  ) {
    return null;
  }

  const session = { name: "Administrador AgendaAI", email: demoCredentials.email, role: "ADMIN" as const };
  localStorage.setItem(sessionKey, JSON.stringify(session));
  window.dispatchEvent(new Event(sessionChangedEvent));
  return session;
}

export function endDemoSession() {
  localStorage.removeItem(sessionKey);
  window.dispatchEvent(new Event(sessionChangedEvent));
}

export function onDemoSessionChange(listener: () => void) {
  window.addEventListener(sessionChangedEvent, listener);
  return () => window.removeEventListener(sessionChangedEvent, listener);
}