import { supabase } from '../lib/supabase'

// User API
export const userAPI = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get user profile
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select()
    
    if (error) throw error
    return data
  },

  // Create user profile after registration
  createUserProfile: async (userData) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Trip API
export const tripAPI = {
  // Get all trips for a user
  getUserTrips: async (userId) => {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        expenseCategories(*),
        expenses:tripExpenses(*)
      `)
      .eq('userId', userId)
    
    if (error) throw error
    return data
  },

  // Get shared trips for a user
  getSharedTrips: async (userId) => {
    const { data, error } = await supabase
      .from('sharedTripMembers')
      .select(`
        tripId,
        trips(
          *,
          expenseCategories(*),
          expenses:tripExpenses(*)
        )
      `)
      .eq('userId', userId)
    
    if (error) throw error
    return data.map(item => item.trips)
  },

  // Get a single trip by ID
  getTripById: async (tripId) => {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        expenseCategories(*),
        expenses:tripExpenses(*),
        sharedWith:sharedTripMembers(userId, users(name, email))
      `)
      .eq('tripId', tripId)
      .single()
    
    if (error) throw error
    return data
  },

  // Create a new trip
  createTrip: async (tripData) => {
    // First create the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert([{
        userId: tripData.userId,
        tripName: tripData.tripName,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budgetAmount: tripData.budgetAmount,
        currency: tripData.currency
      }])
      .select()
    
    if (tripError) throw tripError
    
    // Then create the expense categories
    const categories = tripData.expenseCategories.map(cat => ({
      tripId: trip[0].tripId,
      categoryName: cat.categoryName,
      estimatedAmount: cat.estimatedAmount,
      actualAmount: cat.actualAmount || 0
    }))
    
    const { data: expenseCategories, error: catError } = await supabase
      .from('expenseCategories')
      .insert(categories)
      .select()
    
    if (catError) throw catError
    
    return {
      ...trip[0],
      expenseCategories
    }
  },

  // Update a trip
  updateTrip: async (tripId, updates) => {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('tripId', tripId)
      .select()
    
    if (error) throw error
    return data
  },

  // Delete a trip
  deleteTrip: async (tripId) => {
    // Delete related records first (cascade delete not assumed)
    await supabase.from('sharedTripMembers').delete().eq('tripId', tripId)
    await supabase.from('tripExpenses').delete().eq('tripId', tripId)
    await supabase.from('expenseCategories').delete().eq('tripId', tripId)
    
    // Then delete the trip
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('tripId', tripId)
    
    if (error) throw error
    return true
  }
}

// Expense API
export const expenseAPI = {
  // Add an expense
  addExpense: async (expenseData) => {
    const { data, error } = await supabase
      .from('tripExpenses')
      .insert([expenseData])
      .select()
    
    if (error) throw error
    
    // Update the category actual amount
    await updateCategoryActualAmount(expenseData.tripId, expenseData.categoryId)
    
    return data[0]
  },

  // Update an expense
  updateExpense: async (expenseId, updates) => {
    const { data: oldExpense } = await supabase
      .from('tripExpenses')
      .select('tripId, categoryId')
      .eq('expenseId', expenseId)
      .single()
    
    const { data, error } = await supabase
      .from('tripExpenses')
      .update(updates)
      .eq('expenseId', expenseId)
      .select()
    
    if (error) throw error
    
    // Update the category actual amount for both old and new category if changed
    await updateCategoryActualAmount(oldExpense.tripId, oldExpense.categoryId)
    if (updates.categoryId && updates.categoryId !== oldExpense.categoryId) {
      await updateCategoryActualAmount(oldExpense.tripId, updates.categoryId)
    }
    
    return data[0]
  },

  // Delete an expense
  deleteExpense: async (expenseId) => {
    // Get the expense details first to update category later
    const { data: expense } = await supabase
      .from('tripExpenses')
      .select('tripId, categoryId')
      .eq('expenseId', expenseId)
      .single()
    
    const { error } = await supabase
      .from('tripExpenses')
      .delete()
      .eq('expenseId', expenseId)
    
    if (error) throw error
    
    // Update the category actual amount
    await updateCategoryActualAmount(expense.tripId, expense.categoryId)
    
    return true
  },

  // Get expenses for a trip
  getTripExpenses: async (tripId) => {
    const { data, error } = await supabase
      .from('tripExpenses')
      .select('*')
      .eq('tripId', tripId)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Shared Trip API
export const sharedTripAPI = {
  // Share a trip with a user
  shareTrip: async (tripId, userEmail) => {
    // First find the user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('userId')
      .eq('email', userEmail)
      .single()
    
    if (userError) throw userError
    
    // Then add the sharing relationship
    const { data, error } = await supabase
      .from('sharedTripMembers')
      .insert([{
        tripId,
        userId: user.userId
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Remove a user from a shared trip
  unshareTrip: async (tripId, userId) => {
    const { error } = await supabase
      .from('sharedTripMembers')
      .delete()
      .match({ tripId, userId })
    
    if (error) throw error
    return true
  },

  // Get all users a trip is shared with
  getSharedUsers: async (tripId) => {
    const { data, error } = await supabase
      .from('sharedTripMembers')
      .select(`
        userId,
        users(name, email)
      `)
      .eq('tripId', tripId)
    
    if (error) throw error
    return data.map(item => item.users)
  }
}

// Helper function to update category actual amount
async function updateCategoryActualAmount(tripId, categoryId) {
  // Calculate the sum of expenses for this category
  const { data: expenses, error: sumError } = await supabase
    .from('tripExpenses')
    .select('amount')
    .eq('tripId', tripId)
    .eq('categoryId', categoryId)
  
  if (sumError) throw sumError
  
  const actualAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // Update the category
  const { error: updateError } = await supabase
    .from('expenseCategories')
    .update({ actualAmount })
    .eq('tripId', tripId)
    .eq('categoryId', categoryId)
  
  if (updateError) throw updateError
}

