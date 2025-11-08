import React from 'react';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/expenseUtils';
import { Tag, CreditCard, Repeat, Calendar, FileText, StickyNote } from 'lucide-react';

interface CardViewProps {
  expenses: Expense[];
  onExpenseClick?: (expense: Expense) => void;
}

const CardView: React.FC<CardViewProps> = ({ expenses, onExpenseClick }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Groceries: 'border-green-500 bg-green-50',
      Transportation: 'border-blue-500 bg-blue-50',
      Entertainment: 'border-purple-500 bg-purple-50',
      Dining: 'border-orange-500 bg-orange-50',
      Housing: 'border-red-500 bg-red-50',
      Utilities: 'border-yellow-500 bg-yellow-50',
      Health: 'border-pink-500 bg-pink-50',
      Shopping: 'border-indigo-500 bg-indigo-50',
      'Personal Care': 'border-teal-500 bg-teal-50',
      Education: 'border-cyan-500 bg-cyan-50',
      Insurance: 'border-amber-500 bg-amber-50',
    };
    return colors[category] || 'border-gray-500 bg-gray-50';
  };

  const getCategoryTextColor = (category: string) => {
    const colors: Record<string, string> = {
      Groceries: 'text-green-700',
      Transportation: 'text-blue-700',
      Entertainment: 'text-purple-700',
      Dining: 'text-orange-700',
      Housing: 'text-red-700',
      Utilities: 'text-yellow-700',
      Health: 'text-pink-700',
      Shopping: 'text-indigo-700',
      'Personal Care': 'text-teal-700',
      Education: 'text-cyan-700',
      Insurance: 'text-amber-700',
    };
    return colors[category] || 'text-gray-700';
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className={`bg-white rounded-lg shadow-md border-l-4 ${getCategoryColor(expense.category)} p-5 hover:shadow-lg transition-shadow cursor-pointer`}
          onClick={() => onExpenseClick?.(expense)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${getCategoryTextColor(expense.category)}`}>
                {expense.category}
              </h3>
              <p className="text-sm text-gray-500">{expense.subcategory}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {expense.description}
          </p>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Calendar size={14} />
            <span>{formatDate(expense.date)}</span>
            {expense.recurring && (
              <span className="flex items-center gap-1 ml-auto text-blue-600">
                <Repeat size={14} />
                <span className="text-xs">Recurring</span>
              </span>
            )}
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <CreditCard size={14} />
            <span>{expense.paymentMethod}</span>
          </div>

          {/* Tags */}
          {expense.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {expense.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {expense.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <StickyNote size={12} className="mt-0.5 flex-shrink-0" />
                <p className="line-clamp-2">{expense.notes}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardView;
