import { Category, Transaction, WalletSettings } from '../types';
import { getTodayDateString, getYesterdayDateString } from '../utils/formatters';

export const INITIAL_SETTINGS: WalletSettings = {
  allowance: 3000000,
  title: 'SakuMagang',
  monthPeriod: 'Oktober 2026',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-makan',
    name: 'Makan & Minum',
    icon: 'utensils',
    budget: 900000,
  },
  {
    id: 'cat-trans',
    name: 'Transportasi & Bensin',
    icon: 'bus',
    budget: 400000,
  },
  {
    id: 'cat-kost',
    name: 'Kebutuhan Kost & Harian',
    icon: 'home',
    budget: 1000000,
  },
  {
    id: 'cat-keluarga',
    name: 'Keluarga & Sedekah',
    icon: 'heart',
    budget: 400000,
  },
  {
    id: 'cat-lainnya',
    name: 'Belajar & Lainnya',
    icon: 'book-open',
    budget: 300000,
  },
];

const today = getTodayDateString();
const yesterday = getYesterdayDateString();

// Generate dynamic relative dates
const getDateDaysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const getDemoTransactions = (): Transaction[] => {
  return [
    {
      id: 'tx-demo-1',
      amount: 40000,
      categoryId: 'cat-lainnya',
      note: 'jajan untuk kantor',
      date: today,
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
      id: 'tx-demo-2',
      amount: 25000,
      categoryId: 'cat-makan',
      note: 'Makan siang ayam geprek',
      date: today,
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: 'tx-demo-3',
      amount: 15000,
      categoryId: 'cat-trans',
      note: 'Bensin',
      date: yesterday,
      createdAt: Date.now() - 1000 * 60 * 60 * 26,
    },
    {
      id: 'tx-demo-4',
      amount: 20000,
      categoryId: 'cat-keluarga',
      note: 'Infaq kotak amal',
      date: yesterday,
      createdAt: Date.now() - 1000 * 60 * 60 * 30,
    },
    {
      id: 'tx-demo-5',
      amount: 200000,
      categoryId: 'cat-keluarga',
      note: 'Kirim pulsa & jajan untuk orang favorite',
      date: getDateDaysAgo(3),
      createdAt: Date.now() - 1000 * 60 * 60 * 75,
    },
    {
      id: 'tx-demo-6',
      amount: 45000,
      categoryId: 'cat-lainnya',
      note: 'Beli ATK',
      date: getDateDaysAgo(5),
      createdAt: Date.now() - 1000 * 60 * 60 * 125,
    },
    {
      id: 'tx-demo-7',
      amount: 600000,
      categoryId: 'cat-kost',
      note: 'Bayar kost',
      date: getDateDaysAgo(6),
      createdAt: Date.now() - 1000 * 60 * 60 * 150,
    },
  ];
};

export interface AvailableIconOption {
  id: string;
  label: string;
}

export const AVAILABLE_ICONS: AvailableIconOption[] = [
  { id: 'utensils', label: 'Makan' },
  { id: 'coffee', label: 'Kopi & Minuman' },
  { id: 'bus', label: 'Transportasi' },
  { id: 'heart', label: 'Orang Tua / Sedekah' },
  { id: 'gift', label: 'Hadiah & Traktir' },
  { id: 'home', label: 'Kost & Hunian' },
  { id: 'pill', label: 'Kesehatan' },
  { id: 'book-open', label: 'Belajar & Buku' },
  { id: 'shopping-bag', label: 'Belanja' },
  { id: 'briefcase', label: 'Magang & Kerja' },
  { id: 'shopping-cart', label: 'Kebutuhan Harian' },
  { id: 'fuel', label: 'Bensin & Kendaraan' },
  { id: 'zap', label: 'Listrik & Tagihan' },
  { id: 'film', label: 'Hiburan' },
  { id: 'laptop', label: 'Elektronik' },
  { id: 'receipt', label: 'Kwitansi & Biaya' },
  { id: 'tag', label: 'Lainnya' },
];
