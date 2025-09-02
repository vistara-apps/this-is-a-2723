import React, { createContext, useContext, useState, useCallback } from 'react'

// Create context
const ToastContext = createContext()

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
}

// Provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // Add a new toast
  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 3000) => {
    const id = Date.now().toString()
    
    setToasts(prevToasts => [
      ...prevToasts,
      { id, message, type, duration }
    ])

    // Auto remove toast after duration
    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  // Remove a toast by id
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }, [])

  // Convenience methods for different toast types
  const success = useCallback((message, duration) => 
    addToast(message, TOAST_TYPES.SUCCESS, duration), [addToast])
  
  const error = useCallback((message, duration) => 
    addToast(message, TOAST_TYPES.ERROR, duration), [addToast])
  
  const info = useCallback((message, duration) => 
    addToast(message, TOAST_TYPES.INFO, duration), [addToast])
  
  const warning = useCallback((message, duration) => 
    addToast(message, TOAST_TYPES.WARNING, duration), [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

