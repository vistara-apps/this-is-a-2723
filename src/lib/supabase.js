import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// In a real application, these values would be stored in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema reference:
// Users: userId, email, name, currencyPreference
// Trips: tripId, userId, tripName, startDate, endDate, budgetAmount, currency
// ExpenseCategories: categoryId, tripId, categoryName, estimatedAmount, actualAmount
// TripExpenses: expenseId, tripId, categoryId, description, amount, date, payerId, sharedWith
// SharedTripMembers: tripId, userId

