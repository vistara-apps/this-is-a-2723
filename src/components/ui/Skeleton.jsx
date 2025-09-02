import React from 'react'

function Skeleton({ 
  className = '',
  variant = 'rectangular',
  width,
  height,
  ...props
}) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  
  // Determine classes based on variant
  const variantClasses = {
    rectangular: '',
    circular: 'rounded-full',
    text: 'rounded-md'
  }
  
  // Determine dimensions
  const style = {
    width: width,
    height: height
  }
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  )
}

// Predefined skeleton components
Skeleton.Text = function SkeletonText({ lines = 1, className = '', ...props }) {
  return (
    <div className="space-y-2" {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          variant="text"
          className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'} ${className}`}
        />
      ))}
    </div>
  )
}

Skeleton.Avatar = function SkeletonAvatar({ size = 40, className = '', ...props }) {
  return (
    <Skeleton 
      variant="circular"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
}

Skeleton.Card = function SkeletonCard({ className = '', ...props }) {
  return (
    <div className={`space-y-4 p-4 border rounded-lg ${className}`} {...props}>
      <div className="flex items-center space-x-3">
        <Skeleton.Avatar size={32} />
        <Skeleton.Text lines={1} className="w-1/3" />
      </div>
      <Skeleton.Text lines={3} />
      <Skeleton height={150} />
    </div>
  )
}

export default Skeleton

