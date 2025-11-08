import React from 'react';
import { FilterOptions } from '../types';
import { X, Search, Calendar, DollarSign, Tag, CreditCard, Repeat } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  subcategories: string[];
  paymentMethods: string[];
  tags: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  categories,
  subcategories,
  paymentMethods,
  tags,
}) => {
  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      dateRange: { start: null, end: null, preset: 'all' },
      categories: [],
      subcategories: [],
      paymentMethods: [],
      tags: [],
      amountRange: { min: null, max: null },
      recurring: 'all',
      searchQuery: '',
    });
  };

  const activeFilterCount = [
    filters.dateRange.preset !== 'all' ? 1 : 0,
    filters.categories.length,
    filters.subcategories.length,
    filters.paymentMethods.length,
    filters.tags.length,
    filters.amountRange.min !== null || filters.amountRange.max !== null ? 1 : 0,
    filters.recurring !== 'all' ? 1 : 0,
    filters.searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
          >
            <X size={16} />
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Search size={16} />
          Search
        </label>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          placeholder="Search description, category, tags..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date Range */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar size={16} />
          Date Range
        </label>
        <div className="space-y-2">
          <select
            value={filters.dateRange.preset}
            onChange={(e) =>
              updateFilter('dateRange', {
                ...filters.dateRange,
                preset: e.target.value as FilterOptions['dateRange']['preset'],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {filters.dateRange.preset === 'custom' && (
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange.start || ''}
                onChange={(e) =>
                  updateFilter('dateRange', {
                    ...filters.dateRange,
                    start: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.dateRange.end || ''}
                onChange={(e) =>
                  updateFilter('dateRange', {
                    ...filters.dateRange,
                    end: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Amount Range */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <DollarSign size={16} />
          Amount Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.amountRange.min || ''}
            onChange={(e) =>
              updateFilter('amountRange', {
                ...filters.amountRange,
                min: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            placeholder="Min"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={filters.amountRange.max || ''}
            onChange={(e) =>
              updateFilter('amountRange', {
                ...filters.amountRange,
                max: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            placeholder="Max"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          Categories ({filters.categories.length})
        </label>
        <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category]
                    : filters.categories.filter((c) => c !== category);
                  updateFilter('categories', newCategories);
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          Subcategories ({filters.subcategories.length})
        </label>
        <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
          {subcategories.map((subcategory) => (
            <label key={subcategory} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.subcategories.includes(subcategory)}
                onChange={(e) => {
                  const newSubcategories = e.target.checked
                    ? [...filters.subcategories, subcategory]
                    : filters.subcategories.filter((s) => s !== subcategory);
                  updateFilter('subcategories', newSubcategories);
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{subcategory}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <CreditCard size={16} />
          Payment Methods ({filters.paymentMethods.length})
        </label>
        <div className="space-y-1">
          {paymentMethods.map((method) => (
            <label key={method} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.paymentMethods.includes(method)}
                onChange={(e) => {
                  const newMethods = e.target.checked
                    ? [...filters.paymentMethods, method]
                    : filters.paymentMethods.filter((m) => m !== method);
                  updateFilter('paymentMethods', newMethods);
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Tag size={16} />
          Tags ({filters.tags.length})
        </label>
        <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
          {tags.map((tag) => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={(e) => {
                  const newTags = e.target.checked
                    ? [...filters.tags, tag]
                    : filters.tags.filter((t) => t !== tag);
                  updateFilter('tags', newTags);
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Recurring Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Repeat size={16} />
          Expense Type
        </label>
        <select
          value={filters.recurring}
          onChange={(e) =>
            updateFilter('recurring', e.target.value as FilterOptions['recurring'])
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Expenses</option>
          <option value="recurring">Recurring Only</option>
          <option value="one-time">One-time Only</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
