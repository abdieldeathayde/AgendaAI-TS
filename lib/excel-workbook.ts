import readExcelFile from "read-excel-file/browser";
import writeExcelFile from "write-excel-file/browser";
import type { AgendaData } from "@/lib/agenda-store";

export async function createAgendaWorkbook(data: AgendaData) {
  const workbook = await writeExcelFile([
    {
      sheet: "Clientes",
      data: [
        ["ID", "Nome", "E-mail", "Telefone"],
        ...data.customers.map((customer) => [customer.id, customer.name, customer.email, customer.phone]),
      ],
      columns: [{ width: 10 }, { width: 26 }, { width: 34 }, { width: 22 }],
      stickyRowsCount: 1,
    },
    {
      sheet: "Profissionais",
      data: [
        ["ID", "Nome", "Especialidade", "Biografia"],
        ...data.professionals.map((professional) => [professional.id, professional.name, professional.specialty, professional.bio]),
      ],
      columns: [{ width: 10 }, { width: 26 }, { width: 22 }, { width: 58 }],
      stickyRowsCount: 1,
    },
    {
      sheet: "Serviços",
      data: [
        ["ID", "Profissional ID", "Serviço", "Descrição", "Duração (min)", "Preço (R$)"],
        ...data.services.map((service) => [service.id, service.professionalId, service.name, service.description, service.durationMinutes, service.price]),
      ],
      columns: [{ width: 10 }, { width: 17 }, { width: 28 }, { width: 42 }, { width: 18 }, { width: 16 }],
      stickyRowsCount: 1,
    },
    {
      sheet: "Agenda",
      data: [
        ["ID", "Cliente ID", "Serviço ID", "Início", "Status"],
        ...data.appointments.map((appointment) => [appointment.id, appointment.customerId, appointment.serviceId, appointment.startTime, appointment.status]),
      ],
      columns: [{ width: 10 }, { width: 14 }, { width: 14 }, { width: 30 }, { width: 18 }],
      stickyRowsCount: 1,
    },
  ]);

  return workbook.toBlob();
}

export async function downloadAgendaWorkbook(data: AgendaData) {
  const blob = await createAgendaWorkbook(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "AgendaAI.xlsx";
  link.click();
  URL.revokeObjectURL(url);
}

function textValue(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "").trim();
}

function numberValue(value: unknown, label: string) {
  const number = typeof value === "number" ? value : Number(textValue(value).replace(",", "."));
  if (!Number.isFinite(number)) throw new Error(`Valor inválido na coluna ${label}.`);
  return number;
}

function readRecords(sheets: Awaited<ReturnType<typeof readExcelFile>>, sheetName: string, columns: string[]) {
  const sheet = sheets.find((item) => item.sheet.trim().toLowerCase() === sheetName.toLowerCase());
  if (!sheet) throw new Error(`A aba "${sheetName}" não existe na planilha.`);
  const headers = sheet.data[0]?.map(textValue) ?? [];
  const positions = columns.map((column) => {
    const index = headers.indexOf(column);
    if (index < 0) throw new Error(`A coluna "${column}" não foi encontrada na aba "${sheetName}".`);
    return index;
  });

  return sheet.data.slice(1).filter((row) => row.some((value) => value !== null && value !== "")).map((row) =>
    positions.map((position) => row[position]),
  );
}

export async function readAgendaWorkbook(file: Blob): Promise<AgendaData> {
  const sheets = await readExcelFile(file);
  const customers = readRecords(sheets, "Clientes", ["ID", "Nome", "E-mail", "Telefone"]).map((row) => ({
    id: numberValue(row[0], "ID"),
    name: textValue(row[1]),
    email: textValue(row[2]),
    phone: textValue(row[3]),
  }));
  const professionals = readRecords(sheets, "Profissionais", ["ID", "Nome", "Especialidade", "Biografia"]).map((row) => ({
    id: numberValue(row[0], "ID"),
    name: textValue(row[1]),
    specialty: textValue(row[2]),
    bio: textValue(row[3]),
  }));
  const services = readRecords(sheets, "Serviços", ["ID", "Profissional ID", "Serviço", "Descrição", "Duração (min)", "Preço (R$)"]).map((row) => ({
    id: numberValue(row[0], "ID"),
    professionalId: numberValue(row[1], "Profissional ID"),
    name: textValue(row[2]),
    description: textValue(row[3]),
    durationMinutes: numberValue(row[4], "Duração (min)"),
    price: numberValue(row[5], "Preço (R$)"),
  }));
  const appointments = readRecords(sheets, "Agenda", ["ID", "Cliente ID", "Serviço ID", "Início", "Status"]).map((row) => {
    const status = textValue(row[4]);
    if (!["Agendado", "Confirmado", "Concluído", "Cancelado"].includes(status)) {
      throw new Error(`Status de agendamento inválido: ${status}.`);
    }
    return {
      id: numberValue(row[0], "ID"),
      customerId: numberValue(row[1], "Cliente ID"),
      serviceId: numberValue(row[2], "Serviço ID"),
      startTime: textValue(row[3]),
      status: status as AgendaData["appointments"][number]["status"],
    };
  });

  if (services.some((service) => !professionals.some((professional) => professional.id === service.professionalId))) {
    throw new Error("A planilha tem serviços associados a profissionais inexistentes.");
  }
  if (appointments.some((appointment) =>
    !customers.some((customer) => customer.id === appointment.customerId) ||
    !services.some((service) => service.id === appointment.serviceId),
  )) {
    throw new Error("A planilha tem agendamentos associados a clientes ou serviços inexistentes.");
  }

  return { customers, professionals, services, appointments };
}