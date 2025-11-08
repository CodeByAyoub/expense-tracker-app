import React from 'react';
import { Expense } from '../../types';
import {
  groupExpensesByCategory,
  calculateTotalAmount,
  formatCurrency,
  formatDate,
} from '../../utils/expenseUtils';
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';

interface CategoryViewProps {
  expenses: Expense[];
  onExpenseClick?: (expense: Expense) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ expenses, onExpenseClick }) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set()
  );

  const grouped = groupExpensesByCategory(expenses);
  const totalAmount = calculateTotalAmount(expenses);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Groceries: 'bg-green-100 text-green-800 border-green-300',
      Transportation: 'bg-blue-100 text-blue-800 border-blue-300',
      Entertainment: 'bg-purple-100 text-purple-800 border-purple-300',
      Dining: 'bg-orange-100 text-orange-800 border-orange-300',
      Housing: 'bg-red-100 text-red-800 border-red-300',
      Utilities: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Health: 'bg-pink-100 text-pink-800 border-pink-300',
      Shopping: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Personal Care': 'bg-teal-100 text-teal-800 border-teal-300',
      Education: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      Insurance: 'bg-amber-100 text-amber-800 border-amber-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const sortedCategories = Object.entries(grouped).sort(
    ([, expensesA], [, expensesB]) =>
      calculateTotalAmount(expensesB) - calculateTotalAmount(expensesA)
  );

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Tag size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No expenses found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedCategories.map(([category, categoryExpenses]) => {
        const categoryTotal = calculateTotalAmount(categoryExpenses);
        const percentage = (categoryTotal / totalAmount) * 100;
        const isExpanded = expandedCategories.has(category);

        // Group by subcategory within category
        const subcategoryGroups = categoryExpenses.reduce((acc, expense) => {
          if (!acc[expense.subcategory]) {
            acc[expense.subcategory] = [];
          }
          acc[expense.subcategory].push(expense);
          return acc;
        }, {} as Record<string, Expense[]>);

        return (
          <div
            key={category}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Category Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-gray-600" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-600" />
                  )}
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full border ${getCategoryColor(
                      category
                    )}`}
                  >
                    {category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {categoryExpenses.length} transaction{categoryExpenses.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(categoryTotal)}
                  </div>
                  <div className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                {Object.entries(subcategoryGroups)
                  .sort(
                    ([, expensesA], [, expensesB]) =>
                      calculateTotalAmount(expensesB) - calculateTotalAmount(expensesA)
                  )
                  .map(([subcategory, subExpenses]) => {
                    const subTotal = calculateTotalAmount(subExpenses);
                    const subPercentage = (subTotal / categoryTotal) * 100;

                    return (
                      <div key={subcategory} className="p-4 border-b border-gray-200 last:border-b-0">
                        {/* Subcategory Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{subcategory}</h4>
                            <p className="text-sm text-gray-600">
                              {subExpenses.length} transaction{subExpenses.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatCurrency(subTotal)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {subPercentage.toFixed(1)}% of category
                            </div>
                          </div>
                        </div>

                        {/* Expense List */}
                        <div className="space-y-2 ml-4">
                          {subExpenses
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((expense) => (
                              <div
                                key={expense.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => onExpenseClick?.(expense)}
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {expense.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <p className="text-xs text-gray-600">
                                      {formatDate(expense.date)}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {expense.paymentMethod}
                                    </p>
                                    {expense.tags.length > 0 && (
                                      <div className="flex gap-1">
                                        {expense.tags.slice(0, 2).map((tag) => (
                                          <span
                                            key={tag}
                                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                          >
                                            <Tag size={8} />
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(expense.amount)}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryView;
