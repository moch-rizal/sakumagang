export interface Category {
  id: string;
  name: string;
  icon: string;
  budget: number;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface WalletSettings {
  allowance: number; // e.g. 3000000
  title: string;     // e.g. "Uang Saku MagangHub"
  monthPeriod: string; // e.g. "September 2026"
}

export type TabType = 'home' | 'budget' | 'history' | 'settings';
