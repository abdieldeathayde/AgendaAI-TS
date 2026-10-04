export function formatDateTime(value: string) {
  const [date, time = ""] = value.split("T");
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year} às ${time.slice(0, 5)}`;
}

export function todayForDateInput() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 10);
}