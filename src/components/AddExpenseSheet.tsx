import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../types';
import { getTodayDateString, getYesterdayDateString, formatRupiah } from '../utils/formatters';
import { X, Calendar, Check } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  recentCategories: Category[];
  onAddExpense: (data: {
    amount: number;
    categoryId: string;
    note: string;
    date: string;
  }) => void;
  onOpenAddCategory?: () => void;
}

export const AddExpenseSheet: React.FC<AddExpenseSheetProps> = ({
  isOpen,
  onClose,
  categories,
  recentCategories,
  onAddExpense,
  onOpenAddCategory,
}) => {
  const [rawAmount, setRawAmount] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [dateType, setDateType] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(getTodayDateString());
  const [errorMsg, setErrorMsg] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus amount input on open & set default category to most recent
  useEffect(() => {
    if (isOpen) {
      setRawAmount('');
      setNote('');
      setDateType('today');
      setCustomDate(getTodayDateString());
      setErrorMsg('');
      if (recentCategories.length > 0) {
        setSelectedCategoryId(recentCategories[0].id);
      } else if (categories.length > 0) {
        setSelectedCategoryId(categories[0].id);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, recentCategories, categories]);

  if (!isOpen) return null;

  const numericAmount = parseInt(rawAmount.replace(/\D/g, ''), 10) || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits.length <= 9) { // Cap at 999 million
      setRawAmount(digits);
      if (errorMsg) setErrorMsg('');
    }
  };

  const handleQuickAdd = (increment: number) => {
    const current = numericAmount;
    setRawAmount(String(current + increment));
    if (errorMsg) setErrorMsg('');
  };

  const handleClearAmount = () => {
    setRawAmount('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setErrorMsg('Masukkan jumlah pengeluaran');
      inputRef.current?.focus();
      return;
    }
    if (!selectedCategoryId) {
      setErrorMsg('Pilih kategori pengeluaran');
      return;
    }

    let resolvedDate = getTodayDateString();
    if (dateType === 'yesterday') {
      resolvedDate = getYesterdayDateString();
    } else if (dateType === 'custom') {
      resolvedDate = customDate;
    }

    onAddExpense({
      amount: numericAmount,
      categoryId: selectedCategoryId,
      note: note.trim() || 'Pengeluaran',
      date: resolvedDate,
    });

    onClose();
  };

  return (
    <div
      id="add-expense-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="add-expense-sheet"
        className="w-full sm:max-w-md bg-[#FBF9F5] rounded-t-2xl sm:rounded-2xl border border-[#E7E2D8] p-5 pb-8 sm:pb-6 shadow-xl max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8]/80 mb-4">
          <span className="text-xs font-medium text-[#78716C] tracking-wide uppercase">
            Catat Pengeluaran
          </span>
          <button
            id="btn-close-sheet"
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 -mr-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Large Amount Input */}
          <div className="text-center py-2">
            <label htmlFor="expense-amount-input" className="block text-xs text-[#78716C] mb-1">
              Berapa uang yang dikeluarkan?
            </label>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-2xl font-semibold text-[#78716C]">Rp</span>
              <input
                ref={inputRef}
                id="expense-amount-input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={numericAmount > 0 ? numericAmount.toLocaleString('id-ID') : ''}
                onChange={handleAmountChange}
                className="w-full max-w-[280px] text-center text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1917] bg-transparent border-none outline-none focus:ring-0 p-0 tnum"
              />
            </div>

            {/* Quick amount pills */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickAdd(10000)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#EFECE6] hover:bg-[#E5E0D8] text-[#44403C] transition-colors font-medium"
              >
                +10rb
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(20000)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#EFECE6] hover:bg-[#E5E0D8] text-[#44403C] transition-colors font-medium"
              >
                +20rb
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(50000)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#EFECE6] hover:bg-[#E5E0D8] text-[#44403C] transition-colors font-medium"
              >
                +50rb
              </button>
              {numericAmount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAmount}
                  className="text-xs px-2 py-1 text-[#78716C] hover:text-[#C24138] transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Pakai untuk apa? (Category Selection) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#1C1917]">
                Pakai untuk apa?
              </label>
              {onOpenAddCategory && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAddCategory();
                  }}
                  className="text-xs text-[#1B4931] hover:underline font-medium"
                >
                  + Kategori baru
                </button>
              )}
            </div>

            {/* Recently used / All categories pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm border transition-all ${isSelected
                      ? 'border-[#1B4931] bg-[#1B4931]/8 text-[#1C1917] font-medium'
                      : 'border-[#E7E2D8] bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#44403C]'
                      }`}
                  >
                    <span className={`w-5 h-5 flex items-center justify-center rounded-md shrink-0 ${isSelected ? 'text-[#1B4931]' : 'text-[#78716C]'}`}>
                      <CategoryIcon icon={cat.icon} size="sm" />
                    </span>
                    <span className="truncate flex-1 text-xs sm:text-sm">{cat.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1B4931] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keterangan / Note */}
          <div>
            <label htmlFor="expense-note-input" className="block text-xs font-medium text-[#78716C] mb-1.5">
              Catatan (opsional)
            </label>
            <input
              id="expense-note-input"
              type="text"
              placeholder="Contoh: hadiah untuk orang spesial, makan siang..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4931] transition-colors"
            />
          </div>

          {/* Tanggal / Date */}
          <div>
            <label className="block text-xs font-medium text-[#78716C] mb-1.5">
              Tanggal
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDateType('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${dateType === 'today'
                  ? 'border-[#1B4931] bg-[#1B4931]/10 text-[#1B4931]'
                  : 'border-[#E7E2D8] bg-[#F7F5F0] text-[#57534E] hover:bg-[#EFECE6]'
                  }`}
              >
                Hari ini
              </button>
              <button
                type="button"
                onClick={() => setDateType('yesterday')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${dateType === 'yesterday'
                  ? 'border-[#1B4931] bg-[#1B4931]/10 text-[#1B4931]'
                  : 'border-[#E7E2D8] bg-[#F7F5F0] text-[#57534E] hover:bg-[#EFECE6]'
                  }`}
              >
                Kemarin
              </button>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    setDateType('custom');
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-[#F7F5F0] ${dateType === 'custom'
                    ? 'border-[#1B4931] text-[#1B4931]'
                    : 'border-[#E7E2D8] text-[#57534E]'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <p className="text-xs text-[#C24138] font-medium text-center">
              {errorMsg}
            </p>
          )}

          {/* Primary Action */}
          <button
            id="btn-submit-expense"
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#1B4931] text-white text-sm font-semibold hover:bg-[#254937] active:scale-[0.99] transition-all shadow-xs"
          >
            Simpan pengeluaran
          </button>
        </form>
      </div>
    </div>
  );
};
