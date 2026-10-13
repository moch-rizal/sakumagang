import React from 'react';
import { TabType } from '../types';
import { Home, PieChart, Plus, Clock, Settings } from 'lucide-react';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAddExpense: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddExpense,
}) => {
  return (
    <nav
      id="main-navigation"
      aria-label="Navigasi Utama"
      className="shrink-0 w-full z-30 bg-[#FBF9F5]/98 backdrop-blur-md border-t border-[#E7E2D8] pb-safe select-none"
    >
      <div className="w-full px-3 sm:px-5 h-16 flex items-center justify-between">
        {/* Beranda */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentTab === 'home'
            ? 'text-[#1B4931] font-semibold'
            : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
        >
          <Home className="w-5 h-5 mb-1 stroke-[1.8]" />
          <span className="text-[11px] tracking-tight">Beranda</span>
        </button>

        {/* Anggaran */}
        <button
          id="nav-tab-budget"
          type="button"
          onClick={() => onSelectTab('budget')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentTab === 'budget'
            ? 'text-[#1B4931] font-semibold'
            : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
        >
          <PieChart className="w-5 h-5 mb-1 stroke-[1.8]" />
          <span className="text-[11px] tracking-tight">Anggaran</span>
        </button>

        {/* Central [+] Button */}
        <div className="flex-1 flex justify-center items-center">
          <button
            id="btn-quick-add-expense"
            type="button"
            onClick={onOpenAddExpense}
            aria-label="Catat pengeluaran baru"
            className="w-11 h-11 rounded-full bg-[#1B4931] text-white flex items-center justify-center shadow-sm hover:bg-[#153a27] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#1B4931]/30"
          >
            <Plus className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Riwayat */}
        <button
          id="nav-tab-history"
          type="button"
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentTab === 'history'
            ? 'text-[#1B4931] font-semibold'
            : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
        >
          <Clock className="w-5 h-5 mb-1 stroke-[1.8]" />
          <span className="text-[11px] tracking-tight">Riwayat</span>
        </button>

        {/* Lainnya */}
        <button
          id="nav-tab-settings"
          type="button"
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentTab === 'settings'
            ? 'text-[#1B4931] font-semibold'
            : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
        >
          <Settings className="w-5 h-5 mb-1 stroke-[1.8]" />
          <span className="text-[11px] tracking-tight">Lainnya</span>
        </button>
      </div>
    </nav>
  );
};
