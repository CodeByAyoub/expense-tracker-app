import { Expense, FilterOptions, SortOptions } from '../types';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  parseISO
} from 'date-fns';

export const filterExpenses = (expenses: Expense[], filters: FilterOptions): Expense[] => {
  return expenses.filter(expense => {
    // Date range filter
    if (filters.dateRange.preset !== 'all') {
      const expenseDate = parseISO(expense.date);
      const now = new Date();
      let dateInterval: { start: Date; end: Date } | null = null;

      switch (filters.dateRange.preset) {
        case 'today':
          dateInterval = { start: startOfDay(now), end: endOfDay(now) };
          break;
        case 'week':
          dateInterval = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
          break;
        case 'month':
          dateInterval = { start: startOfMonth(now), end: endOfMonth(now) };
          break;
        case 'year':
          dateInterval = { start: startOfYear(now), end: endOfYear(now) };
          break;
        case 'custom':
          if (filters.dateRange.start && filters.dateRange.end) {
            dateInterval = {
              start: parseISO(filters.dateRange.start),
              end: parseISO(filters.dateRange.end)
            };
          }
          break;
      }

      if (dateInterval && !isWithinInterval(expenseDate, dateInterval)) {
        return false;
      }
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
      return false;
    }

    // Subcategory filter
    if (filters.subcategories.length > 0 && !filters.subcategories.includes(expense.subcategory)) {
      return false;
    }

    // Payment method filter
    if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(expense.paymentMethod)) {
      return false;
    }

    // Tags filter (expense must have at least one of the selected tags)
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => expense.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Amount range filter
    if (filters.amountRange.min !== null && expense.amount < filters.amountRange.min) {
      return false;
    }
    if (filters.amountRange.max !== null && expense.amount > filters.amountRange.max) {
      return false;
    }

    // Recurring filter
    if (filters.recurring === 'recurring' && !expense.recurring) {
      return false;
    }
    if (filters.recurring === 'one-time' && expense.recurring) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(query);
      const matchesCategory = expense.category.toLowerCase().includes(query);
      const matchesSubcategory = expense.subcategory.toLowerCase().includes(query);
      const matchesTags = expense.tags.some(tag => tag.toLowerCase().includes(query));
      const matchesNotes = expense.notes?.toLowerCase().includes(query);

      if (!matchesDescription && !matchesCategory && !matchesSubcategory && !matchesTags && !matchesNotes) {
        return false;
      }
    }

    return true;
  });
};

export const sortExpenses = (expenses: Expense[], sortOptions: SortOptions): Expense[] => {
  const sorted = [...expenses];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortOptions.field) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'description':
        comparison = a.description.localeCompare(b.description);
        break;
    }

    return sortOptions.order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

export const calculateTotalAmount = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const groupExpensesByCategory = (expenses: Expense[]): Record<string, Expense[]> => {
  return expenses.reduce((groups, expense) => {
    const category = expense.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);
};

export const groupExpensesByMonth = (expenses: Expense[]): Record<string, Expense[]> => {
  return expenses.reduce((groups, expense) => {
    const month = expense.date.substring(0, 7); // YYYY-MM
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);
};

export const getCategoryTotals = (expenses: Expense[]): Array<{ category: string; total: number; count: number }> => {
  const grouped = groupExpensesByCategory(expenses);

  return Object.entries(grouped).map(([category, categoryExpenses]) => ({
    category,
    total: calculateTotalAmount(categoryExpenses),
    count: categoryExpenses.length,
  })).sort((a, b) => b.total - a.total);
};

export const getMonthlyTotals = (expenses: Expense[]): Array<{ month: string; total: number; count: number }> => {
  const grouped = groupExpensesByMonth(expenses);

  return Object.entries(grouped).map(([month, monthExpenses]) => ({
    month,
    total: calculateTotalAmount(monthExpenses),
    count: monthExpenses.length,
  })).sort((a, b) => a.month.localeCompare(b.month));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getDateRangeLabel = (preset: FilterOptions['dateRange']['preset']): string => {
  switch (preset) {
    case 'all': return 'All Time';
    case 'today': return 'Today';
    case 'week': return 'This Week';
    case 'month': return 'This Month';
    case 'year': return 'This Year';
    case 'custom': return 'Custom Range';
  }
};
