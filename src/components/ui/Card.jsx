import React from 'react'

function Card({ children, className = '', onClick, ...props }) {
  return (
    <div
      className={`
        bg-surface rounded-lg shadow-card border
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card