// SmartMachines — Formatadores de Dados e Telemetria

export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ —';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '— %';
  }
  return `${value.toFixed(1)}%`;
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatTemp(celsius: number | null | undefined): string {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '— °C';
  return `${celsius.toFixed(1)} °C`;
}

export function formatVibration(mm_s: number | null | undefined): string {
  if (mm_s === null || mm_s === undefined || isNaN(mm_s)) return '— mm/s';
  return `${mm_s.toFixed(2)} mm/s`;
}

export function formatPSI(psi: number | null | undefined): string {
  if (psi === null || psi === undefined || isNaN(psi)) return '— PSI';
  return `${psi.toFixed(1)} PSI`;
}

export function formatCurrent(amp: number | null | undefined): string {
  if (amp === null || amp === undefined || isNaN(amp)) return '— A';
  return `${amp.toFixed(1)} A`;
}

export function formatNoise(db: number | null | undefined): string {
  if (db === null || db === undefined || isNaN(db)) return '— dB';
  return `${db.toFixed(1)} dB`;
}

export function formatHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || isNaN(hours)) return '— h';
  return `${hours.toLocaleString('pt-BR')} h`;
}

export function formatDays(days: number | null | undefined): string {
  if (days === null || days === undefined || isNaN(days)) return '— dias';
  return `${days} ${days === 1 ? 'dia' : 'dias'}`;
}
