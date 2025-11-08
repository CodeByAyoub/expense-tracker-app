import React, { useState, useMemo } from 'react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/expenseUtils';
import { X, FileDown, FileText, FileJson, FileType, Loader2, Calendar, Filter, Eye } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  availableCategories: string[];
}

type ExportFormat = 'csv' | 'json' | 'pdf';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, expenses, availableCategories }) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('expense_export');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filter expenses based on selected criteria
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Date filtering
      if (startDate && expense.date < startDate) return false;
      if (endDate && expense.date > endDate) return false;

      // Category filtering
      if (selectedCategories.length > 0 && !selectedCategories.includes(expense.category)) {
        return false;
      }

      return true;
    });
  }, [expenses, startDate, endDate, selectedCategories]);

  // Calculate summary statistics
  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses]
  );

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === availableCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...availableCategories]);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Subcategory', 'Amount', 'Description', 'Payment Method', 'Tags', 'Recurring', 'Notes'];

    const rows = filteredExpenses.map(expense => [
      expense.date,
      expense.category,
      expense.subcategory,
      expense.amount.toString(),
      expense.description,
      expense.paymentMethod,
      expense.tags.join('; '),
      expense.recurring ? 'Yes' : 'No',
      expense.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
  };

  const exportToJSON = () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalRecords: filteredExpenses.length,
      totalAmount: totalAmount,
      filters: {
        dateRange: { start: startDate || 'all', end: endDate || 'all' },
        categories: selectedCategories.length > 0 ? selectedCategories : 'all'
      },
      expenses: filteredExpenses.map(expense => ({
        id: expense.id,
        date: expense.date,
        category: expense.category,
        subcategory: expense.subcategory,
        amount: expense.amount,
        description: expense.description,
        paymentMethod: expense.paymentMethod,
        tags: expense.tags,
        recurring: expense.recurring,
        notes: expense.notes
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
  };

  const exportToPDF = () => {
    // Create a simple HTML-based PDF content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expense Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .summary-item { display: inline-block; margin-right: 30px; }
          .summary-label { font-weight: bold; color: #6b7280; }
          .summary-value { font-size: 1.2em; color: #1f2937; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #2563eb; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
          tr:nth-child(even) { background: #f9fafb; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <h1>Expense Report</h1>

        <div class="summary">
          <div class="summary-item">
            <div class="summary-label">Total Records:</div>
            <div class="summary-value">${filteredExpenses.length}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Amount:</div>
            <div class="summary-value">${formatCurrency(totalAmount)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Export Date:</div>
            <div class="summary-value">${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        ${startDate || endDate ? `
        <div style="margin: 20px 0;">
          <strong>Date Range:</strong> ${startDate || 'All'} to ${endDate || 'All'}
        </div>
        ` : ''}

        ${selectedCategories.length > 0 ? `
        <div style="margin: 20px 0;">
          <strong>Categories:</strong> ${selectedCategories.join(', ')}
        </div>
        ` : ''}

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            ${filteredExpenses.map(expense => `
              <tr>
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${formatCurrency(expense.amount)}</td>
                <td>${expense.description}</td>
                <td>${expense.paymentMethod}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Generated by Expense Tracker | ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadFile(blob, `${filename}.html`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      switch (format) {
        case 'csv':
          exportToCSV();
          break;
        case 'json':
          exportToJSON();
          break;
        case 'pdf':
          exportToPDF();
          break;
      }

      // Reset and close after successful export
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'csv' as ExportFormat, label: 'CSV', icon: FileText, description: 'Spreadsheet format, compatible with Excel' },
    { value: 'json' as ExportFormat, label: 'JSON', icon: FileJson, description: 'Structured data format for developers' },
    { value: 'pdf' as ExportFormat, label: 'PDF/HTML', icon: FileType, description: 'Formatted document for printing' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileDown size={28} />
            <div>
              <h2 className="text-2xl font-bold">Advanced Data Export</h2>
              <p className="text-blue-100 text-sm">Configure and export your expense data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-500 p-2 rounded-lg transition-colors"
            disabled={isExporting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Export Settings */}
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="space-y-2">
                  {formatOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setFormat(option.value)}
                        className={`w-full flex items-start gap-3 p-4 border-2 rounded-lg transition-all ${
                          format === option.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className={format === option.value ? 'text-blue-600' : 'text-gray-400'}
                          size={24}
                        />
                        <div className="flex-1 text-left">
                          <div className={`font-semibold ${format === option.value ? 'text-blue-600' : 'text-gray-900'}`}>
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          format === option.value ? 'border-blue-600' : 'border-gray-300'
                        }`}>
                          {format === option.value && (
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filename Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Filename
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter filename..."
                  />
                  <span className="text-gray-500 font-medium">.{format}</span>
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Date Range Filter
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Filter size={16} />
                  Category Filter
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <button
                    onClick={handleSelectAllCategories}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
                  >
                    {selectedCategories.length === availableCategories.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <div className="space-y-2">
                    {availableCategories.map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preview & Summary */}
            <div className="space-y-6">
              {/* Export Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Export Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Records:</span>
                    <span className="font-bold text-2xl text-blue-600">{filteredExpenses.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-semibold text-gray-900 uppercase">{format}</span>
                  </div>
                  {(startDate || endDate) && (
                    <div className="pt-3 border-t border-blue-200">
                      <span className="text-sm text-gray-600">Date Range:</span>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {startDate || 'All'} → {endDate || 'All'}
                      </div>
                    </div>
                  )}
                  {selectedCategories.length > 0 && (
                    <div className="pt-3 border-t border-blue-200">
                      <span className="text-sm text-gray-600">Filtered Categories:</span>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {selectedCategories.length} selected
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-gray-700"
              >
                <Eye size={20} />
                {showPreview ? 'Hide Preview' : 'Show Data Preview'}
              </button>

              {/* Data Preview */}
              {showPreview && (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <h4 className="font-semibold text-gray-700 text-sm">Data Preview (First 5 records)</h4>
                  </div>
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Category</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Amount</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.slice(0, 5).map(expense => (
                          <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-600">{expense.date}</td>
                            <td className="px-3 py-2 text-gray-900">{expense.category}</td>
                            <td className="px-3 py-2 text-right text-gray-900 font-medium">
                              {formatCurrency(expense.amount)}
                            </td>
                            <td className="px-3 py-2 text-gray-600 truncate max-w-xs">
                              {expense.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredExpenses.length > 5 && (
                      <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 text-center">
                        ... and {filteredExpenses.length - 5} more records
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredExpenses.length === 0}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Exporting...
              </>
            ) : (
              <>
                <FileDown size={20} />
                Export {filteredExpenses.length} Records
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
