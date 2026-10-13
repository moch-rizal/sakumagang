import React, { useState, useEffect } from 'react';
import { Transaction, Category } from '../types';
import { formatRupiah, formatIndonesianDate } from '../utils/formatters';
import { X, Trash2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  categories: Category[];
  onUpdate: (id: string, data: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  categories,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (transaction) {
      setIsEditing(false);
      setNote(transaction.note);
      setRawAmount(String(transaction.amount));
      setCategoryId(transaction.categoryId);
      setDate(transaction.date);
      setConfirmDelete(false);
    }
  }, [transaction, isOpen]);

  if (!isOpen || !transaction) return null;

  const currentCategory = categories.find((c) => c.id === transaction.categoryId);
  const numericAmount = parseInt(rawAmount.replace(/\D/g, ''), 10) || 0;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    onUpdate(transaction.id, {
      note: note.trim() || 'Pengeluaran',
      amount: numericAmount,
      categoryId,
      date,
    });
    setIsEditing(false);
    onClose();
  };

  return (
    <div
      id="transaction-detail-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="transaction-detail-modal"
        className="w-full sm:max-w-md bg-[#FBF9F5] rounded-t-2xl sm:rounded-2xl border border-[#E7E2D8] p-5 pb-8 sm:pb-6 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8]/80 mb-4">
          <span className="text-xs font-medium text-[#78716C] tracking-wide uppercase">
            Detail Transaksi
          </span>
          <button
            id="btn-close-tx-modal"
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 -mr-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isEditing ? (
          <div>
            <div className="text-center py-3">
              <div className="w-12 h-12 rounded-full bg-[#F2EFE9] border border-[#E7E2D8] flex items-center justify-center text-[#1B4931] mx-auto mb-2">
                <CategoryIcon icon={currentCategory?.icon} size="lg" />
              </div>
              <h3 className="text-base font-semibold text-[#1C1917]">{transaction.note}</h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                {currentCategory?.name || 'Tanpa Kategori'} · {formatIndonesianDate(transaction.date)}
              </p>
              <p className="text-3xl font-bold text-[#1C1917] tracking-tight mt-3 tnum">
                {formatRupiah(transaction.amount)}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#EFECE6] hover:bg-[#E5E0D8] text-xs font-semibold text-[#1C1917] transition-colors"
              >
                Ubah Transaksi
              </button>

              {confirmDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(transaction.id);
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#C24138] hover:bg-[#B9382F] text-xs font-semibold text-white transition-colors"
                >
                  Yakin Hapus?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Hapus transaksi"
                  className="p-2.5 rounded-xl border border-[#E7E2D8] text-[#78716C] hover:text-[#C24138] hover:bg-[#F2EFE9] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1">Jumlah</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-semibold text-[#78716C]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={numericAmount > 0 ? numericAmount.toLocaleString('id-ID') : ''}
                  onChange={(e) => setRawAmount(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917] font-semibold tnum"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1">Keterangan</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#1B4931] text-white text-xs font-semibold hover:bg-[#254937] transition-colors"
              >
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-2.5 px-3 rounded-xl border border-[#E7E2D8] text-xs font-medium text-[#78716C] hover:bg-[#F2EFE9]"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
