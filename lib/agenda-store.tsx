"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { appointments, customers, professionals, services, type Appointment, type Customer, type Professional, type Service } from "@/lib/demo-data";
import { downloadAgendaWorkbook, readAgendaWorkbook } from "@/lib/excel-workbook";

export type AgendaData = {
  customers: Customer[];
  professionals: Professional[];
  services: Service[];
  appointments: Appointment[];
};

type AgendaStore = {
  data: AgendaData;
  ready: boolean;
  spreadsheetStatus: string;
  addCustomer: (customer: Omit<Customer, "id">) => void;
  addProfessional: (professional: Omit<Professional, "id">) => void;
  addService: (service: Omit<Service, "id">) => void;
  addAppointment: (appointment: Omit<Appointment, "id" | "status">) => void;
  downloadSpreadsheet: () => Promise<void>;
  importSpreadsheet: (file: File) => Promise<void>;
};

const storageKey = "agendaai-data-v1";
const initialData: AgendaData = { customers, professionals, services, appointments };
const AgendaStoreContext = createContext<AgendaStore | null>(null);

function isAgendaData(value: unknown): value is AgendaData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return ["customers", "professionals", "services", "appointments"].every((key) => Array.isArray(data[key]));
}

function nextId(records: { id: number }[]) {
  return records.reduce((largest, record) => Math.max(largest, record.id), 0) + 1;
}

export function AgendaDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AgendaData>(initialData);
  const [ready, setReady] = useState(false);
  const [spreadsheetStatus, setSpreadsheetStatus] = useState("Carregando dados");

  function persist(nextData: AgendaData) {
    setData(nextData);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextData));
      setSpreadsheetStatus("Dados salvos neste navegador");
    } catch {
      setSpreadsheetStatus("Não foi possível salvar: o localStorage está indisponível ou cheio");
    }
  }

  useEffect(() => {
    function restoreData() {
      let restoredData: AgendaData | null = null;
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed: unknown = JSON.parse(savedData);
          if (isAgendaData(parsed)) restoredData = parsed;
        }
      } catch {
        try {
          localStorage.removeItem(storageKey);
          setSpreadsheetStatus("Dados locais inválidos; carregando a demonstração");
        } catch {
          setSpreadsheetStatus("O navegador bloqueou o acesso ao localStorage");
        }
      }

      setData(restoredData ?? initialData);
      setReady(true);
      if (restoredData) {
        setSpreadsheetStatus("Dados restaurados do localStorage");
      } else {
        persist(initialData);
      }
    }
    restoreData();
  }, []);

  function addCustomer(customer: Omit<Customer, "id">) {
    persist({ ...data, customers: [...data.customers, { ...customer, id: nextId(data.customers) }] });
  }

  function addProfessional(professional: Omit<Professional, "id">) {
    persist({ ...data, professionals: [...data.professionals, { ...professional, id: nextId(data.professionals) }] });
  }

  function addService(service: Omit<Service, "id">) {
    persist({ ...data, services: [...data.services, { ...service, id: nextId(data.services) }] });
  }

  function addAppointment(appointment: Omit<Appointment, "id" | "status">) {
    persist({
      ...data,
      appointments: [...data.appointments, { ...appointment, id: nextId(data.appointments), status: "Agendado" }],
    });
  }

  async function downloadSpreadsheet() {
    setSpreadsheetStatus("Gerando arquivo Excel");
    try {
      await downloadAgendaWorkbook(data);
      setSpreadsheetStatus("Arquivo AgendaAI.xlsx gerado; confira os downloads do navegador");
    } catch {
      setSpreadsheetStatus("Não foi possível gerar o arquivo Excel");
    }
  }

  async function importSpreadsheet(file: File) {
    const importedData = await readAgendaWorkbook(file);
    persist(importedData);
  }

  return (
    <AgendaStoreContext.Provider value={{
      data,
      ready,
      spreadsheetStatus,
      addCustomer,
      addProfessional,
      addService,
      addAppointment,
      downloadSpreadsheet,
      importSpreadsheet,
    }}>
      {children}
    </AgendaStoreContext.Provider>
  );
}

export function useAgendaStore() {
  const store = useContext(AgendaStoreContext);
  if (!store) throw new Error("useAgendaStore precisa estar dentro de AgendaDataProvider.");
  return store;
}