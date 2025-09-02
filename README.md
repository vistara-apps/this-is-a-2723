# TripBudget Buddy

Budget your dream vacation, track expenses effortlessly.

![TripBudget Buddy Dashboard](https://i.imgur.com/e61c4424.jpeg)

## Overview

TripBudget Buddy is a comprehensive travel budgeting application that helps users estimate trip costs before they go and track spending in real-time while traveling, ensuring they stay within budget.

### Core Features

1. **Pre-trip Expense Estimator**
   - Input anticipated costs for flights, accommodation, activities, food, and miscellaneous expenses
   - Get a total estimated trip cost
   - Plan your budget before booking to determine affordability

2. **Shared Trip Budget Setup**
   - Create a trip budget and invite travel companions
   - Split shared expenses easily
   - Collaborate on trip planning and budgeting

3. **Real-time Expense Tracker**
   - Log expenses as they occur
   - Categorize expenses and assign them to specific trips
   - Support for manual entry and receipt scanning

4. **Budget Burn Rate Visualization**
   - Visual display of spending progress against budget
   - Clear indicators of overspending or underspending
   - Category-specific budget tracking

## Technology Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI API for intelligent expense categorization
- **Data Visualization**: Recharts
- **UI Components**: Custom component library

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (for backend)
- OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tripbudget-buddy.git
   cd tripbudget-buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key (optional)
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Database Schema

The application uses the following data model:

- **User**: userId, email, name, currencyPreference
- **Trip**: tripId, userId, tripName, startDate, endDate, budgetAmount, currency
- **ExpenseCategory**: categoryId, tripId, categoryName, estimatedAmount, actualAmount
- **TripExpense**: expenseId, tripId, categoryId, description, amount, date, payerId, sharedWith
- **SharedTripMember**: tripId, userId

## Business Model

TripBudget Buddy uses a freemium subscription model:

- **Free Tier**: Basic trip budgeting and expense tracking
- **Premium Tier** ($5/month): Unlimited trips, advanced analytics, receipt scanning, and more

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [OpenAI](https://openai.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)

