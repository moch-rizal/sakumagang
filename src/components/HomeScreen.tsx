import React from 'react';
import { Category, Transaction, WalletSettings, TabType } from '../types';
import {
  formatRupiah,
  formatIndonesianDate,
  getSpendingInsight,
} from '../utils/formatters';
import { ArrowRight, Plus } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface HomeScreenProps {
  settings: WalletSettings;
  categories: Category[];
  transactions: Transaction[];
  totalSpent: number;
  remainingAllowance: number;
  totalAllocatedBudget: number;
  categorySpending: Record<string, number>;
  onNavigateTab: (tab: TabType) => void;
  onOpenAddCategory: () => void;
  onSelectCategory: (category: Category) => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onOpenAddExpense: () => void;
  onLoadDemoData?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  settings,
  categories,
  transactions,
  totalSpent,
  remainingAllowance,
  totalAllocatedBudget,
  categorySpending,
  onNavigateTab,
  onOpenAddCategory,
  onSelectCategory,
  onSelectTransaction,
  onOpenAddExpense,
  onLoadDemoData,
}) => {
  // Allowance remaining progress percentage (0 to 100)
  const remainingPercent =
    settings.allowance > 0
      ? Math.max(0, Math.min(100, (remainingAllowance / settings.allowance) * 100))
      : 0;

  const spendingInsight = getSpendingInsight(settings.allowance, totalSpent);

  // Recent 4 transactions for home screen
  const recentTransactions = transactions.slice(0, 4);

  // Top categories (up to 4) for home screen display
  const previewCategories = categories.slice(0, 4);

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  return (
    <div id="home-screen-view" className="space-y-7 pb-6 pt-2">
      {/* 1. TOP HEADER & MAIN BALANCE (Spacious & Elegant) */}
      <section id="wallet-hero" className="pt-2 px-1">
        {/* Small greeting */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium tracking-wide text-[#78716C]">
            {settings.title}
          </p>
          <span className="text-[11px] text-[#A8A29E] font-medium">
            {settings.monthPeriod}
          </span>
        </div>

        {/* Visual Focus: Remaining Money */}
        <div className="mt-1">
          <h1
            id="balance-remaining-amount"
            className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1917] tnum"
          >
            {formatRupiah(remainingAllowance)}
          </h1>
          <p className="text-sm text-[#78716C] mt-1.5 font-normal">
            masih tersedia dari {formatRupiah(settings.allowance)}
          </p>
        </div>

        {/* Thin progress indicator representing allowance remaining */}
        <div
          id="allowance-progress-bar"
          className="w-full h-1.5 bg-[#E7E2D8] rounded-full mt-4 overflow-hidden"
          role="progressbar"
          aria-valuenow={remainingPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${remainingPercent < 15
              ? 'bg-[#C24138]'
              : 'bg-[#1B4931]'
              }`}
            style={{ width: `${remainingPercent}%` }}
          />
        </div>

        {/* Two small pieces of information side-by-side WITHOUT large cards */}
        <div className="flex items-center justify-between pt-4 mt-2">
          <div>
            <span className="block text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
              Sudah dipakai
            </span>
            <span
              id="total-spent-amount"
              className="block text-base sm:text-lg font-semibold text-[#1C1917] mt-0.5 tnum"
            >
              {formatRupiah(totalSpent)}
            </span>
          </div>

          <div className="text-right">
            <span className="block text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
              Dialokasikan
            </span>
            <span
              id="total-allocated-amount"
              className="block text-base sm:text-lg font-semibold text-[#1C1917] mt-0.5 tnum"
            >
              {formatRupiah(totalAllocatedBudget)}
            </span>
          </div>
        </div>
      </section>

      {/* 2. SPENDING STATUS (Conversational, no charts, short and useful) */}
      <section
        id="spending-status-section"
        className={`px-4 py-3 rounded-xl border transition-colors ${spendingInsight.isDanger
          ? 'border-[#C24138]/30 bg-[#C24138]/5'
          : spendingInsight.isWarning
            ? 'border-[#D97706]/30 bg-[#F59E0B]/5'
            : 'border-[#E7E2D8] bg-[#F7F5F0]'
          }`}
      >
        <p
          className={`text-sm font-semibold ${spendingInsight.isDanger
            ? 'text-[#C24138]'
            : spendingInsight.isWarning
              ? 'text-[#B45309]'
              : 'text-[#1B4931]'
            }`}
        >
          {spendingInsight.headline}
        </p>
        <p className="text-xs text-[#57534E] mt-0.5">
          {spendingInsight.supporting}
        </p>
      </section>

      {/* 3. BUDGET SECTION (Clean rows, whitespace & subtle separators, no floating cards) */}
      <section id="budget-home-section" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-[#1C1917]">
            Anggaran
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('budget')}
            className="text-xs text-[#1B4931] hover:text-[#254937] font-medium flex items-center gap-1"
          >
            Lihat semua
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean rows list */}
        <div className="divide-y divide-[#E7E2D8]/80 border-t border-b border-[#E7E2D8]/80">
          {previewCategories.map((category) => {
            const spent = categorySpending[category.id] || 0;
            const budget = category.budget || 0;
            const remaining = Math.max(0, budget - spent);
            const isOver = spent > budget && budget > 0;
            const progress =
              budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category)}
                role="button"
                tabIndex={0}
                className="py-3 px-1 hover:bg-[#F2EFE9]/60 rounded-lg transition-colors cursor-pointer"
              >
                {/* Row Top: Name & Spent vs Budget */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#F2EFE9] border border-[#E7E2D8]/80 text-[#57534E] shrink-0">
                      <CategoryIcon icon={category.icon} size="xs" />
                    </span>
                    <span className="text-sm font-medium text-[#1C1917] truncate">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#78716C] shrink-0 tnum">
                    {formatRupiah(spent)} dari {formatRupiah(budget)}
                  </span>
                </div>

                {/* Progress bar + Sisa */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-1.5 bg-[#E7E2D8] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isOver
                        ? 'bg-[#C24138]'
                        : 'bg-[#1B4931]'
                        }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium shrink-0 tnum ${isOver ? 'text-[#C24138]' : 'text-[#57534E]'
                      }`}
                  >
                    {isOver
                      ? `Lebih ${formatRupiah(spent - budget)}`
                      : `Sisa ${formatRupiah(remaining)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tambah Kategori */}
        <div className="pt-1 px-1">
          <button
            id="btn-add-category-home"
            type="button"
            onClick={onOpenAddCategory}
            className="text-xs font-medium text-[#1B4931] hover:text-[#254937] flex items-center gap-1.5 py-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah kategori
          </button>
        </div>
      </section>

      {/* 4. RECENT ACTIVITY ("Baru-baru ini" wallet feed) */}
      <section id="recent-activity-section" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-[#1C1917]">
            Baru-baru ini
          </h2>
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateTab('history')}
              className="text-xs text-[#1B4931] hover:text-[#254937] font-medium flex items-center gap-1"
            >
              Lihat semua transaksi →
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-7 px-4 text-center text-xs text-[#78716C] bg-[#F7F5F0] rounded-xl border border-[#E7E2D8] space-y-2.5">
            <p>Belum ada transaksi yang dicatat.</p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenAddExpense}
                className="py-1.5 px-3 rounded-lg bg-[#1B4931] text-white font-medium hover:bg-[#34495e] transition-colors shadow-xs"
              >
                + Catat Pengeluaran
              </button>
              {onLoadDemoData && (
                <button
                  type="button"
                  onClick={onLoadDemoData}
                  className="py-1.5 px-3 rounded-lg border border-[#E7E2D8] bg-white text-[#57534E] hover:bg-[#F2EFE9] transition-colors"
                >
                  Coba Data Contoh
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E2D8]/80 border-t border-b border-[#E7E2D8]/80">
            {recentTransactions.map((tx) => {
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
                        {cat?.name || 'Lainnya'} · {formatIndonesianDate(tx.date)}
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
        )}
      </section>
    </div>
  );
};
