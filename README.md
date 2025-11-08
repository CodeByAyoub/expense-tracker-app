# Expense Tracker - CSV Export Feature (v1)

A modern expense tracking application built with React, TypeScript, and TailwindCSS featuring CSV data export functionality.

## Features

### Core Functionality
- **Multiple View Modes**: List, Cards, Calendar, Charts, and Category views
- **Advanced Filtering**: Filter expenses by:
  - Date range (with presets: today, week, month, year)
  - Categories and subcategories
  - Payment methods
  - Tags
  - Amount range
  - Recurring status
  - Search query
- **Smart Sorting**: Sort expenses by date, amount, category, or description
- **Real-time Statistics**: View total expenses, transaction count, and average expense

### CSV Export Feature (v1)

The primary feature of this version is the **CSV Export** functionality that allows users to export their expense data.

#### Export Capabilities
- **One-Click Export**: Simple button click to download all filtered expenses
- **CSV Format**: Exports data in universally compatible CSV format
- **Auto-Generated Filename**: Files are named with timestamp (e.g., `expenses_2024-11-08.csv`)
- **Filtered Data Export**: Exports only the expenses currently visible based on active filters

#### CSV Structure
The exported CSV file includes the following columns:
- **Date**: Transaction date
- **Category**: Expense category
- **Amount**: Transaction amount
- **Description**: Expense description

#### How to Use Export Feature

1. **Filter Your Data** (optional):
   - Use the filter panel to narrow down expenses by date, category, amount, etc.
   - The export will include only the filtered results

2. **Click Export**:
   - Locate the "Export Data" button in the top-right header
   - Click to instantly download your expenses as a CSV file

3. **Access Your Data**:
   - File downloads automatically to your default downloads folder
   - File name format: `expenses_YYYY-MM-DD.csv`
   - Open with Excel, Google Sheets, or any spreadsheet application

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **date-fns** - Date manipulation library
- **Recharts** - Chart visualization library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Server
The app will be available at `http://localhost:5173/`

## Project Structure

```
expense-tracker-ai/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── views/       # Different view mode components
│   │   └── FilterPanel.tsx
│   ├── data/            # Sample data and data utilities
│   ├── utils/           # Utility functions
│   ├── types.ts         # TypeScript type definitions
│   └── App.tsx          # Main application component
├── node_modules/        # Dependencies
└── package.json         # Project configuration
```

## Usage Examples

### Example: Export Monthly Expenses
1. Select "This Month" from the date range filter
2. Click "Export Data" button
3. Open the downloaded CSV file in your spreadsheet application

### Example: Export Specific Category
1. Filter by a specific category (e.g., "Food & Dining")
2. Click "Export Data" to get CSV of only that category
3. Use the data for category-specific analysis

## Data Format

### Sample CSV Output
```csv
Date,Category,Amount,Description
"2024-11-01","Food & Dining","45.50","Lunch at cafe"
"2024-11-02","Transportation","25.00","Uber ride"
"2024-11-03","Shopping","120.00","New headphones"
```

## Key Features Implementation

### handleExportCSV Function
Location: `src/App.tsx:74-104`

The export functionality creates a CSV file from the currently filtered and sorted expenses:
- Generates CSV headers
- Maps expense data to rows
- Properly escapes cell values with quotes
- Creates a downloadable blob
- Triggers automatic download with timestamped filename

## Future Enhancements (Planned for v2 and v3)
- Additional export formats (JSON, Excel)
- Custom column selection
- Export templates
- Scheduled exports
- Cloud storage integration

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License
MIT License

## Contributing
This is a feature branch. For contributions, please create pull requests to the main repository.

## Version History
- **v1.0** - Initial CSV export functionality
  - Basic CSV export with Date, Category, Amount, Description
  - Filtered data export support
  - Auto-generated filenames with timestamps
