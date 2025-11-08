# Expense Tracker

A comprehensive expense tracking application with powerful sorting, filtering, and visualization features.

## Features

### Filtering Options
- **Date Range Filters**: Today, This Week, This Month, This Year, Custom Range, All Time
- **Category Filters**: Multi-select categories to narrow down expenses
- **Subcategory Filters**: Filter by specific subcategories
- **Amount Range**: Set minimum and maximum amounts
- **Payment Methods**: Filter by Cash, Credit Card, Debit Card, Digital Wallet, Bank Transfer
- **Tags**: Filter by multiple tags (expenses matching any selected tag will appear)
- **Recurring Filter**: View all, recurring only, or one-time only expenses
- **Search**: Search across description, category, subcategory, tags, and notes

### Sorting Options
- Sort by Date (newest/oldest)
- Sort by Amount (highest/lowest)
- Sort by Category (A-Z)
- Sort by Description (A-Z)
- Click column headers to toggle sort direction

### Display Views

1. **List View**: Detailed table with sortable columns
2. **Cards View**: Visual card layout with color-coded categories
3. **Calendar View**: Month view showing expenses by date
4. **Charts View**:
   - Category bar chart
   - Category pie chart
   - Payment method distribution
   - Monthly spending trend
   - Category breakdown table
5. **Categories View**: Expandable category groups with subcategory breakdowns

### Statistics Dashboard
- Total expenses for the selected period
- Number of transactions
- Average transaction amount
- Active filter period display

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Recharts (for data visualization)
- date-fns (for date manipulation)
- lucide-react (for icons)

## Usage Tips

### Powerful Filtering Combinations
- Combine multiple filters to drill down into specific expenses
- Use date range + categories to analyze spending patterns
- Filter by tags to track specific types of purchases
- Use amount range to find large or small expenses

### View Modes for Different Insights
- **List View**: Best for detailed transaction review and data entry verification
- **Cards View**: Great for visual scanning and quick expense identification
- **Calendar View**: Perfect for seeing daily spending patterns and planning
- **Charts View**: Ideal for analyzing spending trends and budget allocation
- **Categories View**: Excellent for detailed category analysis and budget tracking

### Workflow Examples

**Budget Analysis**
1. Select "This Month" date range
2. View Charts to see category distribution
3. Switch to Categories view for detailed breakdown
4. Filter specific categories to investigate high spending

**Find Specific Expense**
1. Use Search to find by description or tag
2. Apply date range if you know approximate date
3. Filter by payment method or category
4. Sort by amount if looking for large expenses

**Track Recurring Expenses**
1. Filter by "Recurring Only"
2. View in List or Cards mode
3. Sort by amount to prioritize
4. Use Categories view to see recurring by type

## Data Structure

Expenses include:
- Amount
- Category and Subcategory
- Date
- Description
- Payment Method
- Tags (multiple)
- Recurring flag
- Notes (optional)
