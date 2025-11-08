export interface Expense {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  description: string;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'Digital Wallet' | 'Bank Transfer';
  tags: string[];
  recurring: boolean;
  notes?: string;
}

export interface FilterOptions {
  dateRange: {
    start: string | null;
    end: string | null;
    preset: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
  };
  categories: string[];
  subcategories: string[];
  paymentMethods: string[];
  tags: string[];
  amountRange: {
    min: number | null;
    max: number | null;
  };
  recurring: 'all' | 'recurring' | 'one-time';
  searchQuery: string;
}

export type SortField = 'date' | 'amount' | 'category' | 'description';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

export type ViewMode = 'list' | 'cards' | 'calendar' | 'timeline' | 'charts' | 'categories' | 'comparison';
