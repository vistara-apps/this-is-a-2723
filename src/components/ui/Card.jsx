import React, { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  className = '', 
  onClick, 
  variant = 'default',
  elevation = 'default',
  interactive = false,
  ...props 
}, ref) => {
  // Determine if card is interactive (either by onClick or interactive prop)
  const isInteractive = onClick || interactive
  
  // Variant styles
  const variants = {
    default: 'bg-surface border',
    primary: 'bg-primary bg-opacity-5 border border-primary border-opacity-20',
    success: 'bg-green-50 border border-green-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    error: 'bg-red-50 border border-red-200',
    gradient: 'bg-gradient-card border'
  }
  
  // Elevation styles
  const elevations = {
    none: '',
    default: 'shadow-card',
    medium: 'shadow-md',
    high: 'shadow-lg'
  }
  
  // Interactive styles
  const interactiveClasses = isInteractive 
    ? 'cursor-pointer hover:shadow-lg active:shadow-md active:translate-y-0.5 transition-all duration-200' 
    : ''
  
  return (
    <div
      ref={ref}
      className={`
        rounded-lg ${variants[variant]} ${elevations[elevation]}
        ${interactiveClasses}
        ${className}
      `}
      onClick={onClick}
      tabIndex={isInteractive && !props.tabIndex ? 0 : props.tabIndex}
      role={isInteractive && !props.role ? 'button' : props.role}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card
