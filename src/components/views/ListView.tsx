import React from 'react';
import { Expense, SortOptions, SortField } from '../../types';
import { formatCurrency, formatDate } from '../../utils/expenseUtils';
import { ArrowUpDown, ArrowUp, ArrowDown, Tag, CreditCard, Repeat, FileText } from 'lucide-react';

interface ListViewProps {
  expenses: Expense[];
  sortOptions: SortOptions;
  onSortChange: (options: SortOptions) => void;
  onExpenseClick?: (expense: Expense) => void;
}

const ListView: React.FC<ListViewProps> = ({
  expenses,
  sortOptions,
  onSortChange,
  onExpenseClick,
}) => {
  const handleSort = (field: SortField) => {
    if (sortOptions.field === field) {
      // Toggle order if same field
      onSortChange({
        field,
        order: sortOptions.order === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Default to descending for new field
      onSortChange({ field, order: 'desc' });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortOptions.field !== field) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortOptions.order === 'asc' ? (
      <ArrowUp size={14} className="text-blue-600" />
    ) : (
      <ArrowDown size={14} className="text-blue-600" />
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Groceries: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Dining: 'bg-orange-100 text-orange-800',
      Housing: 'bg-red-100 text-red-800',
      Utilities: 'bg-yellow-100 text-yellow-800',
      Health: 'bg-pink-100 text-pink-800',
      Shopping: 'bg-indigo-100 text-indigo-800',
      'Personal Care': 'bg-teal-100 text-teal-800',
      Education: 'bg-cyan-100 text-cyan-800',
      Insurance: 'bg-amber-100 text-amber-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No expenses found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-2">
                  Description
                  <SortIcon field="description" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-2">
                  Category
                  <SortIcon field="category" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tags
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount
                  <SortIcon field="amount" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onExpenseClick?.(expense)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex flex-col">
                    <span className="font-medium">{expense.description}</span>
                    {expense.recurring && (
                      <span className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                        <Repeat size={12} />
                        Recurring
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-500">{expense.subcategory}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-1 text-gray-700">
                    <CreditCard size={14} />
                    <span>{expense.paymentMethod}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {expense.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                    {expense.tags.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{expense.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-gray-900">
                  {formatCurrency(expense.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
