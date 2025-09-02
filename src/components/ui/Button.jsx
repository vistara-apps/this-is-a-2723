import React from 'react'
import { Loader2 } from 'lucide-react'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '', 
  disabled = false,
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 relative'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5',
    secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5',
    outline: 'bg-transparent border border-gray-300 text-text-primary hover:bg-gray-50 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5',
    ghost: 'bg-transparent text-text-primary hover:bg-gray-100 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5'
  }

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  // Determine what to render inside the button
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
          <span>{loadingText || children}</span>
        </>
      )
    }

    return (
      <>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    )
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      type={type}
      aria-busy={isLoading}
      {...props}
    >
      {renderContent()}
    </button>
  )
}

export default Button
