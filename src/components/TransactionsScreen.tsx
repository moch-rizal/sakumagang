import React, { useState, useMemo } from 'react';
import { Transaction, Category } from '../types';
import { formatRupiah, formatIndonesianDate } from '../utils/formatters';
import { Search, X, Calendar } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface TransactionsScreenProps {
  transactions: Transaction[];
  categories: Category[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenAddExpense: () => void;
}

/**
 * Checks if a transaction date matches the search query:
 * Supports "Hari ini", "Kemarin", "12 Sep", "September", "2026-09-12", "12", etc.
 */
function matchTransactionDate(dateStr: string, query: string): boolean {
  if (!dateStr || !query) return false;
  const q = query.toLowerCase().trim();
  const formattedIndo = formatIndonesianDate(dateStr).toLowerCase();
  if (formattedIndo.includes(q)) return true;
  if (dateStr.toLowerCase().includes(q)) return true;

  const date = new Date(dateStr + 'T00:00:00');
  if (!isNaN(date.getTime())) {
    const fullMonths = [
      'januari', 'februari', 'maret', 'april', 'mei', 'juni',
      'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
    ];
    const monthName = fullMonths[date.getMonth()];
    if (monthName && monthName.includes(q)) return true;

    const dayNum = String(date.getDate());
    if (q === dayNum || q === `tgl ${dayNum}` || q === `tanggal ${dayNum}`) return true;
  }

  return false;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  categories,
  onSelectTransaction,
  onOpenAddExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  // Filter transactions by name/note, category, or date
  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchesCategory =
        selectedCategoryId === 'all' || tx.categoryId === selectedCategoryId;
      if (!matchesCategory) return false;

      if (!query) return true;

      const cat = getCategoryById(tx.categoryId);
      const matchesName = tx.note.toLowerCase().includes(query);
      const matchesCategoryName = cat ? cat.name.toLowerCase().includes(query) : false;
      const matchesDate = matchTransactionDate(tx.date, query);

      return matchesName || matchesCategoryName || matchesDate;
    });
  }, [transactions, selectedCategoryId, searchQuery, categories]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: { dateLabel: string; items: Transaction[] }[] = [];
    const dateMap = new Map<string, Transaction[]>();

    for (const tx of filteredTransactions) {
      const dateKey = tx.date || 'Lainnya';
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(tx);
    }

    // Sort dates descending
    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => b.localeCompare(a));

    for (const dateKey of sortedDates) {
      groups.push({
        dateLabel: formatIndonesianDate(dateKey),
        items: dateMap.get(dateKey)!,
      });
    }

    return groups;
  }, [filteredTransactions]);

  const totalFilteredSpent = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [filteredTransactions]);

  return (
    <div id="transactions-screen-view" className="space-y-5 pb-6 pt-2">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
          Riwayat Pengeluaran
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Cari dan telusuri seluruh catatan transaksi uang saku magangmu.
        </p>
      </div>

      {/* Search Bar & Category Filter */}
      <div id="history-search-section" className="space-y-2.5">
        {/* Search Input */}
        <div id="history-search-bar" className="relative">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="tx-search-input"
            type="text"
            placeholder="Cari nama, kategori, atau tanggal (cth: Cadbury, Makan, Hari ini)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4931] transition-colors"
          />
          {searchQuery && (
            <button
              id="btn-clear-search"
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Hapus pencarian"
              className="absolute right-3 top-2.5 text-[#A8A29E] hover:text-[#1C1917] p-0.5 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-colors ${selectedCategoryId === 'all'
              ? 'border-[#1B4931] bg-[#1B4931]/10 text-[#1B4931]'
              : 'border-[#E7E2D8] bg-[#F7F5F0] text-[#57534E] hover:bg-[#EFECE6]'
              }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() =>
                setSelectedCategoryId(selectedCategoryId === cat.id ? 'all' : cat.id)
              }
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 border flex items-center gap-1.5 transition-colors ${selectedCategoryId === cat.id
                ? 'border-[#1B4931] bg-[#1B4931]/10 text-[#1B4931]'
                : 'border-[#E7E2D8] bg-[#F7F5F0] text-[#57534E] hover:bg-[#EFECE6]'
                }`}
            >
              <CategoryIcon icon={cat.icon} size="xs" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter or Search Info */}
      <div className="flex items-center justify-between px-1 text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <span>{filteredTransactions.length} transaksi</span>
          {searchQuery && (
            <span className="text-[11px] text-[#1B4931] bg-[#1B4931]/10 px-2 py-0.5 rounded-md font-medium">
              Hasil untuk "{searchQuery}"
            </span>
          )}
        </div>
        <span className="font-medium text-[#1C1917] tnum">
          Total: {formatRupiah(totalFilteredSpent)}
        </span>
      </div>

      {/* Transactions Feed */}
      {groupedTransactions.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#78716C] bg-[#F7F5F0] rounded-xl border border-[#E7E2D8] px-4 space-y-2">
          <p className="font-medium text-[#1C1917]">
            {searchQuery
              ? `Tidak ditemukan transaksi dengan kata kunci "${searchQuery}".`
              : 'Tidak ada transaksi dalam kategori ini.'}
          </p>
          <p className="text-[11px] text-[#A8A29E]">
            Coba cari berdasarkan nama transaksi, kategori, atau tanggal seperti "Hari ini", "Kemarin", atau nama bulan.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-lg border border-[#E7E2D8] bg-white text-xs text-[#57534E] hover:bg-[#F2EFE9] transition-colors"
              >
                Hapus pencarian
              </button>
            )}
            <button
              type="button"
              onClick={onOpenAddExpense}
              className="px-3 py-1.5 rounded-lg bg-[#1B4931] text-white text-xs font-semibold hover:bg-[#254937] transition-colors"
            >
              Catat pengeluaran baru
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTransactions.map((group) => (
            <div key={group.dateLabel} className="space-y-1">
              <div className="flex items-center gap-1.5 px-1 pt-1">
                <Calendar className="w-3 h-3 text-[#A8A29E]" />
                <h3 className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
                  {group.dateLabel}
                </h3>
              </div>

              <div className="divide-y divide-[#E7E2D8]/80 border-t border-b border-[#E7E2D8]/80">
                {group.items.map((tx) => {
                  const cat = getCategoryById(tx.categoryId);
                  return (
                    <div
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      role="button"
                      tabIndex={0}
                      className="flex items-center justify-between py-2.5 px-1 hover:bg-[#F2EFE9]/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#F2EFE9] border border-[#E7E2D8]/80 text-[#57534E]">
                          <CategoryIcon icon={cat?.icon} size="sm" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1C1917] truncate">
                            {tx.note}
                          </p>
                          <p className="text-xs text-[#78716C] truncate mt-0.5">
                            {cat?.name || 'Tanpa Kategori'}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-semibold text-[#1C1917] shrink-0 pl-2 tnum">
                        −{formatRupiah(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
