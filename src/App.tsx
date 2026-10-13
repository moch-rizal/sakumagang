import React, { useState, useRef, useEffect } from 'react';
import { TabType, Category, Transaction } from './types';
import { useWallet } from './hooks/useWallet';
import { HomeScreen } from './components/HomeScreen';
import { BudgetScreen } from './components/BudgetScreen';
import { TransactionsScreen } from './components/TransactionsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Navigation } from './components/Navigation';
import { AddExpenseSheet } from './components/AddExpenseSheet';
import { CategoryModal } from './components/CategoryModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';

export default function App() {
  const {
    categories,
    transactions,
    settings,
    totalAllowance,
    totalSpent,
    totalAllocatedBudget,
    remainingAllowance,
    categorySpending,
    recentCategories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    resetToDefault,
    loadDemoData,
    clearTransactions,
  } = useWallet();

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [categoryModalState, setCategoryModalState] = useState<{
    isOpen: boolean;
    categoryToEdit: Category | null;
  }>({
    isOpen: false,
    categoryToEdit: null,
  });
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Category handlers
  const handleOpenAddCategory = () => {
    setCategoryModalState({
      isOpen: true,
      categoryToEdit: null,
    });
  };

  const handleSelectCategory = (category: Category) => {
    setCategoryModalState({
      isOpen: true,
      categoryToEdit: category,
    });
  };

  const handleSaveCategory = (data: { name: string; icon: string; budget: number }) => {
    if (categoryModalState.categoryToEdit) {
      updateCategory(categoryModalState.categoryToEdit.id, data);
    } else {
      addCategory(data);
    }
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  const mainScrollRef = useRef<HTMLElement>(null);

  // Reset scroll position when switching tabs for a clean view
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentTab]);

  return (
    <div className="h-full w-full flex justify-center bg-[#FBF9F5] overflow-hidden">
      {/* Centered personal financial workspace container */}
      <div className="w-full max-w-md sm:max-w-lg h-full flex flex-col bg-[#FBF9F5] sm:border-x sm:border-[#E7E2D8]/70 relative overflow-hidden">
        {/* Scrollable View Area: content scrolls cleanly inside without displacing navigation */}
        <main
          ref={mainScrollRef}
          id="main-scroll-view"
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-6 sm:px-6 flex flex-col"
        >
          {/* Render Active View */}
          {currentTab === 'home' && (
            <HomeScreen
              settings={settings}
              categories={categories}
              transactions={transactions}
              totalSpent={totalSpent}
              remainingAllowance={remainingAllowance}
              totalAllocatedBudget={totalAllocatedBudget}
              categorySpending={categorySpending}
              onNavigateTab={setCurrentTab}
              onOpenAddCategory={handleOpenAddCategory}
              onSelectCategory={handleSelectCategory}
              onSelectTransaction={setSelectedTx}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
              onLoadDemoData={loadDemoData}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetScreen
              categories={categories}
              totalAllowance={totalAllowance}
              totalAllocatedBudget={totalAllocatedBudget}
              categorySpending={categorySpending}
              onOpenAddCategory={handleOpenAddCategory}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {currentTab === 'history' && (
            <TransactionsScreen
              transactions={transactions}
              categories={categories}
              onSelectTransaction={setSelectedTx}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              totalSpent={totalSpent}
              remainingAllowance={remainingAllowance}
              totalCategories={categories.length}
              totalTransactions={transactions.length}
              onUpdateSettings={updateSettings}
              onResetData={resetToDefault}
              onLoadDemoData={loadDemoData}
              onClearTransactions={clearTransactions}
            />
          )}
        </main>

        {/* Bottom Navigation: Stays permanently docked at the bottom of the wallet */}
        <Navigation
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        />
      </div>

      {/* Add Expense Bottom Sheet */}
      <AddExpenseSheet
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        categories={categories}
        recentCategories={recentCategories}
        onAddExpense={addTransaction}
        onOpenAddCategory={handleOpenAddCategory}
      />

      {/* Category Creation / Edit Modal */}
      <CategoryModal
        isOpen={categoryModalState.isOpen}
        onClose={() => setCategoryModalState({ isOpen: false, categoryToEdit: null })}
        categoryToEdit={categoryModalState.categoryToEdit}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Transaction Detail / Edit / Delete Modal */}
      <TransactionDetailModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        categories={categories}
        onUpdate={updateTransaction}
        onDelete={deleteTransaction}
      />
    </div>
  );
}
