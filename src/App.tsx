import React, { useState, useMemo } from 'react';
import { Expense, FilterOptions, SortOptions, ViewMode } from './types';
import { sampleExpenses, getUniqueCategories, getUniqueSubcategories, getUniqueTags, getUniquePaymentMethods } from './data/sampleExpenses';
import { filterExpenses, sortExpenses, calculateTotalAmount, formatCurrency, getDateRangeLabel } from './utils/expenseUtils';
import FilterPanel from './components/FilterPanel';
import ListView from './components/views/ListView';
import CardView from './components/views/CardView';
import ChartsView from './components/views/ChartsView';
import CalendarView from './components/views/CalendarView';
import CategoryView from './components/views/CategoryView';
import {
  List,
  LayoutGrid,
  BarChart3,
  Calendar,
  FolderTree,
  Plus,
  Download,
  TrendingUp,
  DollarSign,
  Receipt,
} from 'lucide-react';

function App() {
  const [expenses] = useState<Expense[]>(sampleExpenses);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { start: null, end: null, preset: 'month' },
    categories: [],
    subcategories: [],
    paymentMethods: [],
    tags: [],
    amountRange: { min: null, max: null },
    recurring: 'all',
    searchQuery: '',
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'date',
    order: 'desc',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(true);

  // Memoized filtered and sorted expenses
  const filteredExpenses = useMemo(
    () => filterExpenses(expenses, filters),
    [expenses, filters]
  );

  const sortedExpenses = useMemo(
    () => sortExpenses(filteredExpenses, sortOptions),
    [filteredExpenses, sortOptions]
  );

  // Statistics
  const totalAmount = useMemo(
    () => calculateTotalAmount(sortedExpenses),
    [sortedExpenses]
  );

  const averageExpense = sortedExpenses.length > 0
    ? totalAmount / sortedExpenses.length
    : 0;

  // Get unique values for filters
  const categories = useMemo(() => getUniqueCategories(expenses), [expenses]);
  const subcategories = useMemo(() => getUniqueSubcategories(expenses), [expenses]);
  const tags = useMemo(() => getUniqueTags(expenses), [expenses]);
  const paymentMethods = useMemo(() => getUniquePaymentMethods(expenses), [expenses]);

  const handleExpenseClick = (expense: Expense) => {
    alert(`Expense Details:\n\n${JSON.stringify(expense, null, 2)}`);
  };

  const handleExportCSV = () => {
    // Create CSV header
    const headers = ['Date', 'Category', 'Amount', 'Description'];

    // Create CSV rows from expenses
    const rows = sortedExpenses.map(expense => [
      expense.date,
      expense.category,
      expense.amount.toString(),
      expense.description
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewButtons = [
    { mode: 'list' as ViewMode, icon: List, label: 'List' },
    { mode: 'cards' as ViewMode, icon: LayoutGrid, label: 'Cards' },
    { mode: 'calendar' as ViewMode, icon: Calendar, label: 'Calendar' },
    { mode: 'charts' as ViewMode, icon: BarChart3, label: 'Charts' },
    { mode: 'categories' as ViewMode, icon: FolderTree, label: 'Categories' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Receipt className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-sm text-gray-600">Manage and analyze your expenses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus size={20} />
                Add Expense
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Download size={20} />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {sortedExpenses.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Receipt className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(averageExpense)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Period</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {getDateRangeLabel(filters.dateRange.preset)}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {viewButtons.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-3">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                categories={categories}
                subcategories={subcategories}
                paymentMethods={paymentMethods}
                tags={tags}
              />
            </div>
          )}

          {/* Content Area */}
          <div className={showFilters ? 'lg:col-span-9' : 'lg:col-span-12'}>
            {/* Result Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {sortedExpenses.length} of {expenses.length} expenses
            </div>

            {/* View Content */}
            {viewMode === 'list' && (
              <ListView
                expenses={sortedExpenses}
                sortOptions={sortOptions}
                onSortChange={setSortOptions}
                onExpenseClick={handleExpenseClick}
              />
            )}
            {viewMode === 'cards' && (
              <CardView
                expenses={sortedExpenses}
                onExpenseClick={handleExpenseClick}
              />
            )}
            {viewMode === 'calendar' && (
              <CalendarView
                expenses={sortedExpenses}
                onExpenseClick={handleExpenseClick}
              />
            )}
            {viewMode === 'charts' && (
              <ChartsView expenses={sortedExpenses} />
            )}
            {viewMode === 'categories' && (
              <CategoryView
                expenses={sortedExpenses}
                onExpenseClick={handleExpenseClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
