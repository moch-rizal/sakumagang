import React, { useState } from 'react';
import { WalletSettings } from '../types';
import { formatRupiah, formatPercentage } from '../utils/formatters';
import { RotateCcw, Check, Sparkles, Github, Code2, Heart, Rocket, RefreshCw } from 'lucide-react';

const BIO_QUOTES = [
  "Duit saku aja dijagain biar gak minus, apalagi hati kamu? Eaaa 🤭",
  "Suka bikin hal-hal kecil yang bikin hidup sehari-hari jadi lebih teratur.",
  "Barangsiapa mempermudah urusan orang lain, Allah akan mempermudah urusannya di dunia dan akhirat. (HR. Muslim)",
  "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain. (HR. Ahmad)",
];

interface SettingsScreenProps {
  settings: WalletSettings;
  totalSpent: number;
  remainingAllowance: number;
  totalCategories: number;
  totalTransactions: number;
  onUpdateSettings: (settings: Partial<WalletSettings>) => void;
  onResetData: () => void;
  onLoadDemoData?: () => void;
  onClearTransactions?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  totalSpent,
  remainingAllowance,
  totalCategories,
  totalTransactions,
  onUpdateSettings,
  onResetData,
  onLoadDemoData,
  onClearTransactions,
}) => {
  const [isEditingAllowance, setIsEditingAllowance] = useState(false);
  const [rawAllowance, setRawAllowance] = useState(String(settings.allowance));
  const [title, setTitle] = useState(settings.title);
  const [period, setPeriod] = useState(settings.monthPeriod);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * BIO_QUOTES.length));

  const numericAllowance = parseInt(rawAllowance.replace(/\D/g, ''), 10) || 0;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAllowance > 0) {
      onUpdateSettings({
        allowance: numericAllowance,
        title: title.trim() || 'Uang Saku MagangHub',
        monthPeriod: period.trim() || 'Bulan Ini',
      });
      setIsEditingAllowance(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const spentPercent =
    settings.allowance > 0 ? (totalSpent / settings.allowance) * 100 : 0;

  return (
    <div id="settings-screen-view" className="space-y-6 pb-6 pt-2">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1917]">
          Pengaturan
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Sesuaikan alokasi uang saku magang dan preferensi dompetmu.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#1B4931]/10 border border-[#1B4931]/20 text-xs font-semibold text-[#1B4931]">
          <Check className="w-4 h-4" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      {/* Main Settings Card/Block */}
      <section className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
            Uang Saku Magang
          </span>
          {!isEditingAllowance && (
            <button
              type="button"
              onClick={() => {
                setRawAllowance(String(settings.allowance));
                setTitle(settings.title);
                setPeriod(settings.monthPeriod);
                setIsEditingAllowance(true);
              }}
              className="text-xs text-[#1B4931] hover:underline font-semibold"
            >
              Ubah
            </button>
          )}
        </div>

        {!isEditingAllowance ? (
          <div>
            <div className="text-2xl font-bold text-[#1C1917] tracking-tight tnum">
              {formatRupiah(settings.allowance)}
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              {settings.title} · {settings.monthPeriod}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-[#E7E2D8] text-xs">
              <div>
                <span className="text-[#78716C]">Total terpakai:</span>
                <p className="font-semibold text-[#1C1917] mt-0.5 tnum">
                  {formatRupiah(totalSpent)} ({formatPercentage(spentPercent)})
                </p>
              </div>
              <div>
                <span className="text-[#78716C]">Sisa uang saku:</span>
                <p className="font-semibold text-[#1B4931] mt-0.5 tnum">
                  {formatRupiah(remainingAllowance)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1">
                Jumlah Uang Saku (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-[#78716C]">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={numericAllowance > 0 ? numericAllowance.toLocaleString('id-ID') : ''}
                  onChange={(e) => setRawAllowance(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E7E2D8] text-sm text-[#1C1917] font-semibold tnum"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1">
                Judul Dompet
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Uang Saku MagangHub"
                className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E7E2D8] text-sm text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#78716C] mb-1">
                Periode / Bulan
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Oktober 2026"
                className="w-full px-3 py-2 rounded-xl bg-[#FBF9F5] border border-[#E7E2D8] text-sm text-[#1C1917]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#1B4931] text-white text-xs font-semibold hover:bg-[#254937] transition-colors"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsEditingAllowance(false)}
                className="py-2 px-3 rounded-xl border border-[#E7E2D8] text-xs font-medium text-[#78716C] hover:bg-[#EFECE6]"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Info Ringkasan Data */}
      <section className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] space-y-2">
        <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
          Ringkasan Catatan
        </span>
        <div className="flex items-center justify-between text-xs py-1 text-[#57534E]">
          <span>Kategori aktif:</span>
          <span className="font-semibold text-[#1C1917]">{totalCategories} pos anggaran</span>
        </div>
        <div className="flex items-center justify-between text-xs py-1 text-[#57534E]">
          <span>Total transaksi:</span>
          <span className="font-semibold text-[#1C1917]">{totalTransactions} transaksi</span>
        </div>
      </section>

      {/* Kelola Data (Data Demo & Reset) */}
      <section className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E7E2D8] space-y-3">
        <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
          Kelola Data
        </span>

        <div className="grid grid-cols-2 gap-2">
          {onLoadDemoData && (
            <button
              type="button"
              onClick={onLoadDemoData}
              className="py-2 px-3 rounded-xl border border-[#1B4931]/30 bg-[#1B4931]/5 text-xs text-[#1B4931] hover:bg-[#1B4931]/10 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1B4931]" />
              Isi Data Demo
            </button>
          )}

          {onClearTransactions && (
            <button
              type="button"
              onClick={onClearTransactions}
              className="py-2 px-3 rounded-xl border border-[#E7E2D8] text-xs text-[#78716C] hover:text-[#C24138] hover:bg-[#F2EFE9] transition-colors flex items-center justify-center gap-1.5"
            >
              Hapus Semua Riwayat
            </button>
          )}
        </div>

        {showResetConfirm ? (
          <div className="p-3.5 rounded-xl border border-[#C24138]/40 bg-[#C24138]/5 space-y-2.5">
            <p className="text-xs text-[#C24138] font-medium">
              Kembalikan ke data awal (Rp3.000.000, kategori default, dan bersihkan riwayat)?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="py-1.5 px-3 rounded-lg bg-[#C24138] text-white text-xs font-semibold hover:bg-[#B9382F]"
              >
                Ya, Reset Data
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-1.5 px-3 rounded-lg border border-[#E7E2D8] bg-white text-xs text-[#78716C]"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2 px-4 rounded-xl border border-[#E7E2D8] text-xs text-[#78716C] hover:text-[#C24138] hover:bg-[#F2EFE9] transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Semua ke Template Pabrik
          </button>
        )}
      </section>

      {/* Tentang Aplikasi & Pengembang (combined) */}
      <section className="p-4 rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] space-y-3">
        {/* Tentang Aplikasi */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#1C1917] text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1B4931]" />
            <span>Tentang Aplikasi</span>
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed">
            Aplikasi ini adalah proyek pribadi yang dirancang untuk membantu teman-teman dalam mencatat dan mengatur keuangan dengan lebih mudah.
          </p>
        </div>

        <div className="border-t border-[#E7E2D8]" />

        {/* Developer Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-[#1B4931]/15 text-[#1B4931] flex items-center justify-center font-bold text-xs border border-[#1B4931]/30">
              AR
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#1C1917]">Arif</h3>
              <p className="text-[11px] text-[#78716C]">Creator & Developer</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/80 border border-[#E7E2D8] text-[#57534E] font-medium">
            Status: Single 😁
          </span>
        </div>

        {/* Bio Singkat (Bisa Diklik & Berubah Otomatis/Manual) */}
        <button
          type="button"
          onClick={() => setQuoteIndex((prev) => (prev + 1) % BIO_QUOTES.length)}
          className="w-full text-left group text-xs text-[#57534E] leading-relaxed bg-white/70 hover:bg-white p-2.5 rounded-xl border border-[#E7E2D8]/70 hover:border-[#1B4931]/30 transition-all cursor-pointer relative"
          title="Klik untuk ganti quote"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="flex-1 italic">
              "{BIO_QUOTES[quoteIndex]}"
            </p>
            <RefreshCw className="w-3 h-3 text-[#A8A29E] group-hover:text-[#1B4931] group-hover:rotate-180 transition-all shrink-0 mt-0.5" />
          </div>
        </button>

        {/* Next Project Teaser */}
        <div className="p-2.5 rounded-xl bg-white/60 border border-[#E7E2D8] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1917]">
            <Rocket className="w-3.5 h-3.5 text-[#1B4931]" />
            <span>Next Project:</span>
          </div>
          <p className="text-xs font-medium text-[#1B4931]">
            Aplikasi Rekomendasi Tempat Main & Nongkrong
          </p>
          <p className="text-[11px] text-[#78716C] leading-relaxed italic">
            "Biar setelah pinter ngatur duit di sini, kita tahu ke mana harus ngabisin budget main tanpa takut boncos!"
          </p>
        </div>

        {/* GitHub Link */}
        <div className="pt-1 border-t border-[#E7E2D8]/80 flex items-center justify-between text-xs">
          <span className="text-[#78716C] text-[11px]">GitHub Profile:</span>
          <a
            href="https://github.com/moch-rizal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#1B4931] hover:text-[#153a27] font-semibold text-xs transition-colors hover:underline"
          >
            <Github className="w-3.5 h-3.5" />
            <span>@moch-rizal</span>
          </a>
        </div>
      </section>

      {/* Footer Signature */}
      <div className="pt-2 text-center text-[11px] text-[#A8A29E] space-y-0.5 pb-2">
        <p className="font-medium text-[#78716C]">SakuMagang v1.0.0</p>
        <p className="text-[10px]">© 2026 Arif</p>
      </div>
    </div>
  );
};
