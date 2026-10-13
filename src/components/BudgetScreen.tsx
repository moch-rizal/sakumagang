import React from 'react';
import { Category } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Plus, Edit2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface BudgetScreenProps {
  categories: Category[];
  totalAllowance: number;
  totalAllocatedBudget: number;
  categorySpending: Record<string, number>;
  onOpenAddCategory: () => void;
  onSelectCategory: (category: Category) => void;
}

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  categories,
  totalAllowance,
  totalAllocatedBudget,
  categorySpending,
  onOpenAddCategory,
  onSelectCategory,
}) => {
  const unallocated = totalAllowance - totalAllocatedBudget;

  return (
    <div id="budget-screen-view" className="space-y-6 pb-6 pt-2">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
          Anggaran
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Atur dan pantau batas pengeluaran untuk setiap kebutuhan.
        </p>

        {/* Minimalist Allocation summary */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] flex items-center justify-between text-xs">
          <div>
            <span className="text-[#78716C]">Total Dialokasikan:</span>
            <span className="font-semibold text-[#1C1917] ml-1.5 tnum">
              {formatRupiah(totalAllocatedBudget)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#78716C]">
              {unallocated >= 0 ? 'Sisa Alokasi:' : 'Melebihi Saku:'}
            </span>
            <span
              className={`font-semibold ml-1.5 tnum ${unallocated < 0 ? 'text-[#C24138]' : 'text-[#1B4931]'
                }`}
            >
              {formatRupiah(Math.abs(unallocated))}
            </span>
          </div>
        </div>
      </div>

      {/* Category Rows List */}
      <section className="space-y-1">
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
            Daftar Pos Pengeluaran ({categories.length})
          </span>
          <span className="text-[11px] text-[#A8A29E]">
            Ketuk untuk ubah/hapus
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#78716C] bg-[#F7F5F0] rounded-xl border border-[#E7E2D8]">
            Belum ada kategori anggaran.
            <div className="mt-2">
              <button
                type="button"
                onClick={onOpenAddCategory}
                className="text-[#1B4931] font-semibold underline"
              >
                Tambah kategori pertama
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E2D8]/80 border-t border-b border-[#E7E2D8]/80">
            {categories.map((category) => {
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
                  className="py-3.5 px-1 hover:bg-[#F2EFE9]/60 rounded-lg transition-colors cursor-pointer group"
                >
                  {/* Category Title & Numbers */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-[#F2EFE9] border border-[#E7E2D8]/80 text-[#57534E]">
                        <CategoryIcon icon={category.icon} size="sm" />
                      </span>
                      <span className="text-sm font-medium text-[#1C1917] truncate group-hover:text-[#1B4931] transition-colors">
                        {category.name}
                      </span>
                      <Edit2 className="w-3 h-3 text-[#A8A29E] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs text-[#78716C] tnum">
                        {formatRupiah(spent)} dari {formatRupiah(budget)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar + Sisa */}
                  <div className="flex items-center gap-3 mt-2.5">
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
        )}

        {/* Add Category Button at bottom */}
        <div className="pt-3 px-1">
          <button
            id="btn-add-category-budget-page"
            type="button"
            onClick={onOpenAddCategory}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#1B4931]/40 text-[#1B4931] hover:bg-[#1B4931]/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah kategori
          </button>
        </div>
      </section>
    </div>
  );
};
