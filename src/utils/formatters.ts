/**
 * Formats a number into Indonesian Rupiah representation: Rp3.000.000
 */
export function formatRupiah(amount: number, prefix: boolean = true): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(Math.round(amount));
  const formatted = absVal.toLocaleString('id-ID');
  
  if (prefix) {
    return `${isNegative ? '−' : ''}Rp${formatted}`;
  }
  return `${isNegative ? '−' : ''}${formatted}`;
}

/**
 * Returns formatted Indonesian date:
 * - "Hari ini"
 * - "Kemarin"
 * - "12 Sep" (natural Indonesian format)
 */
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  
  const today = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateZero = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = todayZero.getTime() - dateZero.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hari ini';
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    // If different year, append year
    if (date.getFullYear() !== today.getFullYear()) {
      return `${day} ${month} ${date.getFullYear()}`;
    }
    return `${day} ${month}`;
  }
}

/**
 * Format today's date in YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format yesterday's date in YYYY-MM-DD
 */
export function getYesterdayDateString(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format percentage in Indonesian locale (e.g. 18,8%)
 */
export function formatPercentage(val: number): string {
  return val.toLocaleString('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + '%';
}

/**
 * Generates natural Indonesian spending status without generic fluff
 */
export function getSpendingInsight(totalAllowance: number, totalSpent: number): {
  headline: string;
  supporting: string;
  isWarning: boolean;
  isDanger: boolean;
} {
  if (totalAllowance <= 0) {
    return {
      headline: 'Atur uang sakumu',
      supporting: 'Tentukan jumlah uang saku di menu pengaturan.',
      isWarning: false,
      isDanger: false,
    };
  }

  const ratio = totalSpent / totalAllowance;
  const percentText = formatPercentage(ratio * 100);

  if (ratio <= 0.35) {
    return {
      headline: 'Pengeluaranmu masih aman',
      supporting: `Kamu sudah menggunakan ${percentText} dari uang saku.`,
      isWarning: false,
      isDanger: false,
    };
  }

  if (ratio < 0.75) {
    return {
      headline: 'Pengeluaran berjalan stabil',
      supporting: `Kamu sudah menggunakan ${percentText} dari uang saku.`,
      isWarning: false,
      isDanger: false,
    };
  }

  if (ratio <= 1.0) {
    return {
      headline: 'Pengeluaran mulai mendekati batas anggaran.',
      supporting: `Sudah terpakai ${percentText}. Sisakan untuk kebutuhan prioritas.`,
      isWarning: true,
      isDanger: false,
    };
  }

  return {
    headline: 'Pengeluaran telah melebihi batas uang saku.',
    supporting: `Sudah terpakai ${percentText}. Cek kembali anggaran kategori.`,
    isWarning: false,
    isDanger: true,
  };
}
