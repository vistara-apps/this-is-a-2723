import React, { createContext, useContext, useReducer } from 'react'

const TripBudgetContext = createContext()

const initialState = {
  trips: [],
  currentTrip: null,
  user: {
    userId: '1',
    email: 'user@example.com',
    name: 'Travel Enthusiast',
    currencyPreference: 'USD'
  }
}

function tripBudgetReducer(state, action) {
  switch (action.type) {
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
    
    case 'UPDATE_TRIP_BUDGET':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.tripId === action.payload.tripId
            ? { ...trip, expenseCategories: action.payload.categories }
            : trip
        )
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
        )
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
        )
      }
    
    default:
      return state
  }
}

export function TripBudgetProvider({ children }) {
  const [state, dispatch] = useReducer(tripBudgetReducer, initialState)

  const addTrip = (trip) => {
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

  const setCurrentTrip = (trip) => {
    dispatch({ type: 'SET_CURRENT_TRIP', payload: trip })
  }

  const updateTripBudget = (tripId, categories) => {
    dispatch({ type: 'UPDATE_TRIP_BUDGET', payload: { tripId, categories } })
  }

  const addExpense = (tripId, expense) => {
    const newExpense = {
      ...expense,
      expenseId: Date.now().toString(),
      date: expense.date || new Date().toISOString().split('T')[0]
    }
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
  }

  const value = {
    ...state,
    addTrip,
    setCurrentTrip,
    updateTripBudget,
    addExpense
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