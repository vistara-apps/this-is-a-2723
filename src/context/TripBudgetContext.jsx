import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { tripAPI, expenseAPI, sharedTripAPI } from '../services/api'

const TripBudgetContext = createContext()

const initialState = {
  trips: [],
  sharedTrips: [],
  currentTrip: null,
  loading: false,
  error: null
}

function tripBudgetReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
      
    case 'SET_TRIPS':
      return {
        ...state,
        trips: action.payload
      }
      
    case 'SET_SHARED_TRIPS':
      return {
        ...state,
        sharedTrips: action.payload
      }
      
    case 'ADD_TRIP':
      return {
        ...state,
        trips: [...state.trips, action.payload]
      }
    
    case 'SET_CURRENT_TRIP':
      return {
        ...state,
        currentTrip: action.payload
      }
    
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? { ...trip, ...action.payload.updates }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId
          ? { ...state.currentTrip, ...action.payload.updates }
          : state.currentTrip
      }
    
    case 'UPDATE_TRIP_BUDGET':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? { ...trip, expenseCategories: action.payload.categories }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId
          ? { ...state.currentTrip, expenseCategories: action.payload.categories }
          : state.currentTrip
      }
    
    case 'ADD_EXPENSE':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? {
                ...trip,
                expenses: [...(trip.expenses || []), action.payload.expense]
              }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId
          ? {
              ...state.currentTrip,
              expenses: [...(state.currentTrip.expenses || []), action.payload.expense]
            }
          : state.currentTrip
      }
      
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? {
                ...trip,
                expenses: trip.expenses.map(expense =>
                  expense.expenseId === action.payload.expenseId
                    ? { ...expense, ...action.payload.updates }
                    : expense
                )
              }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId
          ? {
              ...state.currentTrip,
              expenses: state.currentTrip.expenses.map(expense =>
                expense.expenseId === action.payload.expenseId
                  ? { ...expense, ...action.payload.updates }
                  : expense
              )
            }
          : state.currentTrip
      }
      
    case 'DELETE_EXPENSE':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? {
                ...trip,
                expenses: trip.expenses.filter(expense => 
                  expense.expenseId !== action.payload.expenseId
                )
              }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId
          ? {
              ...state.currentTrip,
              expenses: state.currentTrip.expenses.filter(expense => 
                expense.expenseId !== action.payload.expenseId
              )
            }
          : state.currentTrip
      }
    
    case 'UPDATE_CATEGORY_ACTUAL':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? {
                ...trip,
                expenseCategories: trip.expenseCategories.map(cat =>
                  cat.categoryId === action.payload.categoryId
                    ? { ...cat, actualAmount: action.payload.actualAmount }
                    : cat
                )
              }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId
          ? {
              ...state.currentTrip,
              expenseCategories: state.currentTrip.expenseCategories.map(cat =>
                cat.categoryId === action.payload.categoryId
                  ? { ...cat, actualAmount: action.payload.actualAmount }
                  : cat
              )
            }
          : state.currentTrip
      }
      
    case 'SHARE_TRIP':
      const { tripId, userId, userData } = action.payload
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === tripId
            ? {
                ...trip,
                sharedWith: [...(trip.sharedWith || []), { userId, ...userData }]
              }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === tripId
          ? {
              ...state.currentTrip,
              sharedWith: [...(state.currentTrip.sharedWith || []), { userId, ...userData }]
            }
          : state.currentTrip
      }
      
    case 'UNSHARE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? {
                ...trip,
                sharedWith: (trip.sharedWith || []).filter(user => 
                  user.userId !== action.payload.userId
                )
              }
            : trip
        ),
        currentTrip: state.currentTrip?.tripId === action.payload.tripId
          ? {
              ...state.currentTrip,
              sharedWith: (state.currentTrip.sharedWith || []).filter(user => 
                user.userId !== action.payload.userId
              )
            }
          : state.currentTrip
      }
    
    default:
      return state
  }
}

export function TripBudgetProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(tripBudgetReducer, initialState)

  // Load trips when user changes
  useEffect(() => {
    if (user) {
      loadTrips()
    }
  }, [user])

  // Load trips from API
  const loadTrips = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Load user's trips
      const trips = await tripAPI.getUserTrips(user.id)
      dispatch({ type: 'SET_TRIPS', payload: trips })
      
      // Load shared trips
      const sharedTrips = await tripAPI.getSharedTrips(user.id)
      dispatch({ type: 'SET_SHARED_TRIPS', payload: sharedTrips })
    } catch (error) {
      console.error('Error loading trips:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Add a new trip
  const addTrip = async (trip) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Create default expense categories if not provided
      const expenseCategories = trip.expenseCategories || [
        { categoryName: 'Flights', estimatedAmount: 0, actualAmount: 0 },
        { categoryName: 'Accommodation', estimatedAmount: 0, actualAmount: 0 },
        { categoryName: 'Food & Dining', estimatedAmount: 0, actualAmount: 0 },
        { categoryName: 'Activities', estimatedAmount: 0, actualAmount: 0 },
        { categoryName: 'Transportation', estimatedAmount: 0, actualAmount: 0 },
        { categoryName: 'Miscellaneous', estimatedAmount: 0, actualAmount: 0 }
      ]
      
      // Create trip in API
      const newTrip = await tripAPI.createTrip({
        ...trip,
        userId: user.id,
        expenseCategories
      })
      
      // Add to local state
      dispatch({ type: 'ADD_TRIP', payload: newTrip })
      return newTrip
    } catch (error) {
      console.error('Error adding trip:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Set current trip
  const setCurrentTrip = (trip) => {
    dispatch({ type: 'SET_CURRENT_TRIP', payload: trip })
  }

  // Update trip details
  const updateTrip = async (tripId, updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Update trip in API
      await tripAPI.updateTrip(tripId, updates)
      
      // Update local state
      dispatch({ type: 'UPDATE_TRIP', payload: { tripId, updates } })
    } catch (error) {
      console.error('Error updating trip:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Update trip budget categories
  const updateTripBudget = async (tripId, categories) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Update categories in API
      // This would require multiple API calls to update each category
      for (const category of categories) {
        // API call to update category
      }
      
      // Update local state
      dispatch({ type: 'UPDATE_TRIP_BUDGET', payload: { tripId, categories } })
    } catch (error) {
      console.error('Error updating trip budget:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Add an expense
  const addExpense = async (tripId, expense) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Create expense in API
      const newExpense = await expenseAPI.addExpense({
        ...expense,
        tripId,
        date: expense.date || new Date().toISOString().split('T')[0]
      })
      
      // Add to local state
      dispatch({ type: 'ADD_EXPENSE', payload: { tripId, expense: newExpense } })
      
      // Update category actual amount
      const trip = state.trips.find(t => t.tripId === tripId)
      if (trip) {
        const category = trip.expenseCategories.find(c => c.categoryId === expense.categoryId)
        if (category) {
          const newActualAmount = category.actualAmount + expense.amount
          dispatch({ 
            type: 'UPDATE_CATEGORY_ACTUAL', 
            payload: { tripId, categoryId: expense.categoryId, actualAmount: newActualAmount }
          })
        }
      }
      
      return newExpense
    } catch (error) {
      console.error('Error adding expense:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Update an expense
  const updateExpense = async (tripId, expenseId, updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Get the current expense
      const trip = state.trips.find(t => t.tripId === tripId)
      const currentExpense = trip?.expenses.find(e => e.expenseId === expenseId)
      
      if (!currentExpense) {
        throw new Error('Expense not found')
      }
      
      // Update expense in API
      await expenseAPI.updateExpense(expenseId, {
        ...updates,
        tripId
      })
      
      // Update local state
      dispatch({ type: 'UPDATE_EXPENSE', payload: { tripId, expenseId, updates } })
      
      // If category changed, update both categories' actual amounts
      if (updates.categoryId && updates.categoryId !== currentExpense.categoryId) {
        // Subtract from old category
        const oldCategory = trip.expenseCategories.find(c => c.categoryId === currentExpense.categoryId)
        if (oldCategory) {
          const newOldActualAmount = oldCategory.actualAmount - currentExpense.amount
          dispatch({ 
            type: 'UPDATE_CATEGORY_ACTUAL', 
            payload: { tripId, categoryId: currentExpense.categoryId, actualAmount: newOldActualAmount }
          })
        }
        
        // Add to new category
        const newCategory = trip.expenseCategories.find(c => c.categoryId === updates.categoryId)
        if (newCategory) {
          const newActualAmount = newCategory.actualAmount + (updates.amount || currentExpense.amount)
          dispatch({ 
            type: 'UPDATE_CATEGORY_ACTUAL', 
            payload: { tripId, categoryId: updates.categoryId, actualAmount: newActualAmount }
          })
        }
      } 
      // If only amount changed, update the current category
      else if (updates.amount && updates.amount !== currentExpense.amount) {
        const category = trip.expenseCategories.find(c => c.categoryId === currentExpense.categoryId)
        if (category) {
          const amountDiff = updates.amount - currentExpense.amount
          const newActualAmount = category.actualAmount + amountDiff
          dispatch({ 
            type: 'UPDATE_CATEGORY_ACTUAL', 
            payload: { tripId, categoryId: currentExpense.categoryId, actualAmount: newActualAmount }
          })
        }
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Delete an expense
  const deleteExpense = async (tripId, expenseId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Get the current expense
      const trip = state.trips.find(t => t.tripId === tripId)
      const expense = trip?.expenses.find(e => e.expenseId === expenseId)
      
      if (!expense) {
        throw new Error('Expense not found')
      }
      
      // Delete expense in API
      await expenseAPI.deleteExpense(expenseId)
      
      // Update local state
      dispatch({ type: 'DELETE_EXPENSE', payload: { tripId, expenseId } })
      
      // Update category actual amount
      const category = trip.expenseCategories.find(c => c.categoryId === expense.categoryId)
      if (category) {
        const newActualAmount = category.actualAmount - expense.amount
        dispatch({ 
          type: 'UPDATE_CATEGORY_ACTUAL', 
          payload: { tripId, categoryId: expense.categoryId, actualAmount: newActualAmount }
        })
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Share a trip with another user
  const shareTrip = async (tripId, email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Share trip in API
      const sharedUser = await sharedTripAPI.shareTrip(tripId, email)
      
      // Update local state
      dispatch({ 
        type: 'SHARE_TRIP', 
        payload: { 
          tripId, 
          userId: sharedUser.userId,
          userData: { email, name: sharedUser.name }
        } 
      })
    } catch (error) {
      console.error('Error sharing trip:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Remove a user from a shared trip
  const unshareTrip = async (tripId, userId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Unshare trip in API
      await sharedTripAPI.unshareTrip(tripId, userId)
      
      // Update local state
      dispatch({ type: 'UNSHARE_TRIP', payload: { tripId, userId } })
    } catch (error) {
      console.error('Error unsharing trip:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // For local development/testing without API
  const addTripLocal = (trip) => {
    const newTrip = {
      ...trip,
      tripId: Date.now().toString(),
      expenses: [],
      expenseCategories: [
        { categoryId: '1', categoryName: 'Flights', estimatedAmount: 0, actualAmount: 0 },
        { categoryId: '2', categoryName: 'Accommodation', estimatedAmount: 0, actualAmount: 0 },
        { categoryId: '3', categoryName: 'Food & Dining', estimatedAmount: 0, actualAmount: 0 },
        { categoryId: '4', categoryName: 'Activities', estimatedAmount: 0, actualAmount: 0 },
        { categoryId: '5', categoryName: 'Transportation', estimatedAmount: 0, actualAmount: 0 },
        { categoryId: '6', categoryName: 'Miscellaneous', estimatedAmount: 0, actualAmount: 0 }
      ]
    }
    dispatch({ type: 'ADD_TRIP', payload: newTrip })
    return newTrip
  }

  const value = {
    ...state,
    addTrip: user ? addTrip : addTripLocal, // Use API if user is logged in, otherwise use local
    setCurrentTrip,
    updateTrip,
    updateTripBudget,
    addExpense,
    updateExpense,
    deleteExpense,
    shareTrip,
    unshareTrip,
    refreshTrips: loadTrips
  }

  return (
    <TripBudgetContext.Provider value={value}>
      {children}
    </TripBudgetContext.Provider>
  )
}

export function useTripBudget() {
  const context = useContext(TripBudgetContext)
  if (!context) {
    throw new Error('useTripBudget must be used within a TripBudgetProvider')
  }
  return context
}
