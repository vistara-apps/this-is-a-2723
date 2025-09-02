import React from 'react'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button