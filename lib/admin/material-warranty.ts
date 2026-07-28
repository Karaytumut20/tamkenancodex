const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDateOnly(value?: string | null) {
  if (!value || !DATE_ONLY_PATTERN.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateOnly(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function getTurkeyDateOnly() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Europe/Istanbul",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function calculateWarrantyEndDate(
  startDate?: string | null,
  warrantyMonths?: number | null,
) {
  const parsed = parseDateOnly(startDate);
  const months = Math.max(0, Math.trunc(Number(warrantyMonths || 0)));
  if (!parsed || months === 0) return null;

  const originalDay = parsed.getUTCDate();
  const target = new Date(Date.UTC(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth() + months,
    1,
  ));
  const lastDayOfTargetMonth = new Date(Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth() + 1,
    0,
  )).getUTCDate();

  target.setUTCDate(Math.min(originalDay, lastDayOfTargetMonth));
  return toDateOnly(target);
}

export function formatMaterialDate(value?: string | null) {
  const parsed = parseDateOnly(value?.slice(0, 10));
  if (!parsed) return "Belirtilmedi";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatElapsedSince(value?: string | null, today = getTurkeyDateOnly()) {
  const start = parseDateOnly(value?.slice(0, 10));
  const end = parseDateOnly(today);
  if (!start || !end) return null;
  if (start.getTime() > end.getTime()) return "Gelecek tarih";

  let totalMonths = (
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12
    + end.getUTCMonth()
    - start.getUTCMonth()
  );
  if (end.getUTCDate() < start.getUTCDate()) totalMonths -= 1;

  if (totalMonths <= 0) {
    const days = Math.floor((end.getTime() - start.getTime()) / 86_400_000);
    if (days === 0) return "Bugün";
    return `${days} gün önce`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} ay önce`;
  if (months === 0) return `${years} yıl önce`;
  return `${years} yıl ${months} ay önce`;
}

export function getWarrantyStatus(input: {
  warrantyMonths?: number | null;
  warrantyStartDate?: string | null;
  warrantyEndDate?: string | null;
  today?: string;
}) {
  const warrantyMonths = Math.max(0, Math.trunc(Number(input.warrantyMonths || 0)));
  if (warrantyMonths === 0) {
    return {
      key: "none" as const,
      label: "Garanti belirtilmedi",
      detail: null,
    };
  }

  const endDate = input.warrantyEndDate
    || calculateWarrantyEndDate(input.warrantyStartDate, warrantyMonths);

  if (!endDate) {
    return {
      key: "missing-date" as const,
      label: `${warrantyMonths} ay`,
      detail: "Başlangıç tarihi belirtilmedi",
    };
  }

  const today = input.today || getTurkeyDateOnly();
  const isExpired = endDate < today;

  return {
    key: isExpired ? "expired" as const : "active" as const,
    label: isExpired ? "Garanti süresi doldu" : "Garanti devam ediyor",
    detail: `${formatMaterialDate(endDate)} tarihine kadar`,
  };
}
