import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { TOAST_TYPES } from '../../context/ToastContext'

function Toast({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false)
  
  // Handle the exit animation
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 200) // Match the animation duration
  }

  // Auto close after duration
  useEffect(() => {
    if (toast.duration !== Infinity) {
      const timer = setTimeout(() => {
        handleClose()
      }, toast.duration)
      
      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id])

  // Get icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case TOAST_TYPES.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case TOAST_TYPES.WARNING:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case TOAST_TYPES.INFO:
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  // Get background color based on toast type
  const getBgColor = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-50 border-green-200'
      case TOAST_TYPES.ERROR:
        return 'bg-red-50 border-red-200'
      case TOAST_TYPES.WARNING:
        return 'bg-yellow-50 border-yellow-200'
      case TOAST_TYPES.INFO:
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div 
      className={`
        flex items-center justify-between p-4 mb-3 rounded-lg shadow-md border
        ${getBgColor()}
        ${isExiting ? 'animate-fade-out' : 'animate-slide-up'}
        transition-all duration-200
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center">
        {getIcon()}
        <p className="ml-3 text-sm font-medium text-text-primary">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}

export default Toast
