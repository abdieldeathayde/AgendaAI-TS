export type AppointmentStatus = "Agendado" | "Confirmado" | "Concluído" | "Cancelado";

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export type Professional = {
  id: number;
  name: string;
  specialty: string;
  bio: string;
};

export type Service = {
  id: number;
  professionalId: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
};

export type Appointment = {
  id: number;
  customerId: number;
  serviceId: number;
  startTime: string;
  status: AppointmentStatus;
};

export const customers: Customer[] = [
  { id: 1, name: "Carlos Silva", email: "carlos.silva@example.com", phone: "(47) 98888-1001" },
  { id: 2, name: "Beatriz Souza", email: "beatriz.souza@example.com", phone: "(47) 98888-1002" },
  { id: 3, name: "Fernando Lima", email: "fernando.lima@example.com", phone: "(47) 98888-1003" },
  { id: 4, name: "Mariana Alves", email: "mariana.alves@example.com", phone: "(47) 98888-1004" },
  { id: 5, name: "Rafael Oliveira", email: "rafael.oliveira@example.com", phone: "(47) 98888-1005" },
  { id: 6, name: "Camila Martins", email: "camila.martins@example.com", phone: "(47) 98888-1006" },
  { id: 7, name: "João Pereira", email: "joao.pereira@example.com", phone: "(47) 98888-1007" },
  { id: 8, name: "Larissa Costa", email: "larissa.costa@example.com", phone: "(47) 98888-1008" },
  { id: 9, name: "Gustavo Rocha", email: "gustavo.rocha@example.com", phone: "(47) 98888-1009" },
  { id: 10, name: "Aline Mendes", email: "aline.mendes@example.com", phone: "(47) 98888-1010" },
  { id: 11, name: "Pedro Santos", email: "pedro.santos@example.com", phone: "(47) 98888-1011" },
  { id: 12, name: "Isabela Ramos", email: "isabela.ramos@example.com", phone: "(47) 98888-1012" },
];

export const professionals: Professional[] = [
  { id: 1, name: "Lucas Barbosa", specialty: "Barbeiro", bio: "Cortes clássicos e contemporâneos com atenção aos detalhes." },
  { id: 2, name: "Amanda Silva", specialty: "Cabeleireira", bio: "Cor, textura e cuidado para cada tipo de cabelo." },
  { id: 3, name: "Rodrigo Santos", specialty: "Visagista", bio: "Consultoria de imagem personalizada e prática." },
  { id: 4, name: "Juliana Costa", specialty: "Esteticista", bio: "Tratamentos faciais com foco em saúde e bem-estar." },
  { id: 5, name: "Marcos Lima", specialty: "Terapeuta", bio: "Técnicas de relaxamento para renovar a rotina." },
];

export const services: Service[] = [
  { id: 1, professionalId: 1, name: "Corte Masculino", description: "Corte personalizado com acabamento", durationMinutes: 45, price: 35 },
  { id: 2, professionalId: 1, name: "Barba", description: "Modelagem e toalha quente", durationMinutes: 30, price: 25 },
  { id: 3, professionalId: 2, name: "Corte Feminino", description: "Corte e finalização", durationMinutes: 60, price: 80 },
  { id: 4, professionalId: 2, name: "Coloração", description: "Coloração com avaliação prévia", durationMinutes: 120, price: 160 },
  { id: 5, professionalId: 3, name: "Visagismo", description: "Análise de estilo e imagem pessoal", durationMinutes: 60, price: 100 },
  { id: 6, professionalId: 3, name: "Consultoria de Estilo", description: "Orientação de cores e combinações", durationMinutes: 60, price: 110 },
  { id: 7, professionalId: 4, name: "Limpeza de Pele", description: "Higienização e tratamento facial", durationMinutes: 60, price: 90 },
  { id: 8, professionalId: 4, name: "Design de Sobrancelhas", description: "Design adequado ao formato do rosto", durationMinutes: 30, price: 35 },
  { id: 9, professionalId: 5, name: "Massagem Relaxante", description: "Sessão terapêutica de relaxamento", durationMinutes: 60, price: 120 },
  { id: 10, professionalId: 5, name: "Hidratação", description: "Tratamento capilar intensivo", durationMinutes: 45, price: 65 },
];

export const appointments: Appointment[] = [
  { id: 1, customerId: 1, serviceId: 1, startTime: "2026-10-03T09:00", status: "Confirmado" },
  { id: 2, customerId: 2, serviceId: 4, startTime: "2026-10-03T10:00", status: "Agendado" },
  { id: 3, customerId: 3, serviceId: 7, startTime: "2026-10-03T11:30", status: "Confirmado" },
  { id: 4, customerId: 4, serviceId: 9, startTime: "2026-10-03T13:00", status: "Agendado" },
  { id: 5, customerId: 5, serviceId: 2, startTime: "2026-10-04T09:30", status: "Agendado" },
  { id: 6, customerId: 6, serviceId: 5, startTime: "2026-10-04T11:00", status: "Concluído" },
  { id: 7, customerId: 7, serviceId: 3, startTime: "2026-10-05T14:00", status: "Agendado" },
  { id: 8, customerId: 8, serviceId: 8, startTime: "2026-10-05T15:30", status: "Cancelado" },
  { id: 9, customerId: 9, serviceId: 6, startTime: "2026-10-06T10:00", status: "Confirmado" },
  { id: 10, customerId: 10, serviceId: 10, startTime: "2026-10-06T13:00", status: "Agendado" },
];