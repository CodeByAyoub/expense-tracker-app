import React from 'react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/expenseUtils';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  expenses: Expense[];
  onExpenseClick?: (expense: Expense) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ expenses, onExpenseClick }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getExpensesForDay = (day: Date) => {
    return expenses.filter((expense) => isSameDay(parseISO(expense.date), day));
  };

  const getDayTotal = (day: Date) => {
    const dayExpenses = getExpensesForDay(day);
    return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === currentMonth.getMonth();
  };

  const isToday = (day: Date) => {
    return isSameDay(day, new Date());
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon size={24} className="text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-700 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayExpenses = getExpensesForDay(day);
          const dayTotal = getDayTotal(day);
          const hasExpenses = dayExpenses.length > 0;
          const inCurrentMonth = isCurrentMonth(day);
          const today = isToday(day);

          return (
            <div
              key={index}
              className={`
                min-h-[120px] border rounded-lg p-2 transition-all
                ${!inCurrentMonth ? 'bg-gray-50 opacity-50' : 'bg-white'}
                ${today ? 'border-blue-500 border-2' : 'border-gray-200'}
                ${hasExpenses && inCurrentMonth ? 'hover:shadow-md cursor-pointer' : ''}
              `}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium
                    ${today ? 'text-blue-600 font-bold' : 'text-gray-900'}
                    ${!inCurrentMonth ? 'text-gray-400' : ''}
                  `}
                >
                  {format(day, 'd')}
                </span>
                {hasExpenses && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    {dayExpenses.length}
                  </span>
                )}
              </div>

              {/* Expenses for the day */}
              {hasExpenses && inCurrentMonth && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-900 mb-1">
                    {formatCurrency(dayTotal)}
                  </div>
                  {dayExpenses.slice(0, 2).map((expense) => (
                    <div
                      key={expense.id}
                      onClick={() => onExpenseClick?.(expense)}
                      className="text-xs p-1 bg-blue-50 rounded border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer truncate"
                      title={expense.description}
                    >
                      <div className="font-medium text-blue-900 truncate">
                        {expense.description}
                      </div>
                      <div className="text-blue-700">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                  ))}
                  {dayExpenses.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayExpenses.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
          <span>Has expenses</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
