"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { appointments, customers, professionals, services, type Appointment, type Customer, type Professional, type Service } from "@/lib/demo-data";
import { createAgendaWorkbook, downloadAgendaWorkbook, readAgendaWorkbook } from "@/lib/excel-workbook";

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
const databaseName = "agendaai-workbooks";
const objectStoreName = "files";
const workbookKey = "agendaai.xlsx";
const initialData: AgendaData = { customers, professionals, services, appointments };
const AgendaStoreContext = createContext<AgendaStore | null>(null);

function openWorkbookDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Este navegador não oferece armazenamento local de planilhas."));
      return;
    }
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(objectStoreName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível abrir o armazenamento local."));
  });
}

async function storeWorkbook(blob: Blob) {
  const database = await openWorkbookDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(objectStoreName, "readwrite");
    transaction.objectStore(objectStoreName).put(blob, workbookKey);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Não foi possível salvar a planilha."));
    transaction.onabort = () => reject(transaction.error ?? new Error("O salvamento da planilha foi cancelado."));
  });
  database.close();
}

async function loadWorkbook() {
  const database = await openWorkbookDatabase();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const request = database.transaction(objectStoreName, "readonly").objectStore(objectStoreName).get(workbookKey);
    request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : null);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível abrir a planilha salva."));
  });
  database.close();
  return blob;
}

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
  const writeQueue = useRef(Promise.resolve());

  function persist(nextData: AgendaData) {
    setData(nextData);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextData));
      setSpreadsheetStatus("Salvando planilha neste navegador");
      writeQueue.current = writeQueue.current
        .then(async () => storeWorkbook(await createAgendaWorkbook(nextData)))
        .then(() => setSpreadsheetStatus("Planilha salva neste navegador"))
        .catch(() => setSpreadsheetStatus("Dados salvos no navegador; falha ao gravar o arquivo Excel local"));
    } catch {
      setSpreadsheetStatus("Armazenamento local indisponível neste navegador");
    }
  }

  useEffect(() => {
    let active = true;
    async function restoreData() {
      let restoredData: AgendaData | null = null;
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed: unknown = JSON.parse(savedData);
          if (isAgendaData(parsed)) restoredData = parsed;
        }
        if (!restoredData) {
          const workbook = await loadWorkbook();
          if (workbook) restoredData = await readAgendaWorkbook(workbook);
        }
      } catch {
        setSpreadsheetStatus("A planilha salva não pôde ser lida; usando dados de demonstração");
      }

      if (!active) return;
      setData(restoredData ?? initialData);
      setReady(true);
      if (restoredData) {
        setSpreadsheetStatus("Planilha carregada neste navegador");
      } else {
        persist(initialData);
      }
    }
    void restoreData();
    return () => { active = false; };
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