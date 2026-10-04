import "./globals.css";
import type { Metadata } from "next";
import AppShell from "./components/app-shell";
import { AgendaDataProvider } from "@/lib/agenda-store";

export const metadata: Metadata = {
  title: "AgendaAI",
  description: "Demonstração frontend de gestão de agendamentos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AgendaDataProvider>
          <AppShell>{children}</AppShell>
        </AgendaDataProvider>
      </body>
    </html>
  );
}
