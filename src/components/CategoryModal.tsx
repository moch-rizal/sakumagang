import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { AVAILABLE_ICONS } from '../data/initialData';
import { CategoryIcon, resolveIconName } from './CategoryIcon';
import { X, Trash2 } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  onSaveCategory: (data: { name: string; icon: string; budget: number }) => void;
  onDeleteCategory?: (id: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('utensils');
  const [rawBudget, setRawBudget] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setConfirmDelete(false);
      if (categoryToEdit) {
        setName(categoryToEdit.name);
        setIcon(resolveIconName(categoryToEdit.icon));
        setRawBudget(String(categoryToEdit.budget));
      } else {
        setName('');
        setIcon('utensils');
        setRawBudget('300000');
      }
    }
  }, [isOpen, categoryToEdit]);

  if (!isOpen) return null;

  const numericBudget = parseInt(rawBudget.replace(/\D/g, ''), 10) || 0;

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRawBudget(digits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama kategori tidak boleh kosong');
      return;
    }

    onSaveCategory({
      name: name.trim(),
      icon: icon || 'tag',
      budget: numericBudget,
    });
    onClose();
  };

  return (
    <div
      id="category-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="category-modal"
        className="w-full sm:max-w-md bg-[#FBF9F5] rounded-t-2xl sm:rounded-2xl border border-[#E7E2D8] p-5 pb-8 sm:pb-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8]/80 mb-4">
          <h2 className="text-sm font-semibold text-[#1C1917]">
            {categoryToEdit ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
          </h2>
          <button
            id="btn-close-category-modal"
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 -mr-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name & Icon Preview */}
          <div>
            <label htmlFor="category-name-input" className="block text-xs font-medium text-[#78716C] mb-1.5">
              Nama Kategori
            </label>
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 flex items-center justify-center bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl text-[#1B4931] shrink-0">
                <CategoryIcon icon={icon} size="md" />
              </span>
              <input
                id="category-name-input"
                type="text"
                placeholder="Contoh: Makan & Jajan, Transportasi"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4931] transition-colors"
              />
            </div>
          </div>

          {/* Icon Chooser */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#78716C]">
                Pilih Simbol Kategori
              </label>
              <span className="text-[11px] text-[#A8A29E]">
                {AVAILABLE_ICONS.find((i) => i.id === icon)?.label || 'Minimalis'}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8]">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() => setIcon(item.id)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all border ${isSelected
                      ? 'bg-white border-[#1B4931] text-[#1B4931] shadow-xs'
                      : 'border-transparent text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE6]/80'
                      }`}
                  >
                    <CategoryIcon
                      icon={item.id}
                      size="sm"
                      className={isSelected ? 'text-[#1B4931]' : 'text-[#78716C]'}
                    />
                    <span className="text-xs truncate font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Limit */}
          <div>
            <label htmlFor="category-budget-input" className="block text-xs font-medium text-[#78716C] mb-1.5">
              Batas Anggaran Bulanan
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-[#78716C]">
                Rp
              </span>
              <input
                id="category-budget-input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={numericBudget > 0 ? numericBudget.toLocaleString('id-ID') : ''}
                onChange={handleBudgetChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] text-sm text-[#1C1917] font-medium placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1B4931] transition-colors tnum"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#C24138] font-medium">{errorMsg}</p>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-2">
            <button
              id="btn-save-category"
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#1B4931] text-white text-sm font-semibold hover:bg-[#254937] transition-all shadow-xs"
            >
              Simpan Kategori
            </button>

            {categoryToEdit && onDeleteCategory && (
              confirmDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCategory(categoryToEdit.id);
                    onClose();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#C24138] text-white text-xs font-semibold hover:bg-[#B9382F] transition-colors"
                >
                  Yakin Hapus?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Hapus kategori"
                  className="p-2.5 rounded-xl border border-[#E7E2D8] text-[#78716C] hover:text-[#C24138] hover:bg-[#F2EFE9] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
