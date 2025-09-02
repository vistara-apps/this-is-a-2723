import React, { useState, useEffect } from 'react'

function Input({ 
  label, 
  error,
  required = false,
  validate,
  onValidate,
  helperText,
  className = '', 
  ...props 
}) {
  const [localError, setLocalError] = useState('')
  const [touched, setTouched] = useState(false)
  const [value, setValue] = useState(props.value || '')
  
  // Display either passed error or local validation error
  const displayError = error || (touched ? localError : '')
  
  // Handle validation
  useEffect(() => {
    if (validate && touched) {
      const validationError = validate(value)
      setLocalError(validationError || '')
      if (onValidate) {
        onValidate(!validationError)
      }
    }
  }, [value, validate, touched, onValidate])
  
  // Handle value changes from parent
  useEffect(() => {
    if (props.value !== undefined && props.value !== value) {
      setValue(props.value)
    }
  }, [props.value])
  
  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)
    
    if (props.onChange) {
      props.onChange(e)
    }
  }
  
  const handleBlur = (e) => {
    setTouched(true)
    
    if (props.onBlur) {
      props.onBlur(e)
    }
  }
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-text-primary flex items-center"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-md text-text-primary placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          ${displayError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        aria-invalid={displayError ? 'true' : 'false'}
        aria-describedby={props.id ? `${props.id}-error` : undefined}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        {...props}
      />
      {displayError ? (
        <p 
          className="text-sm text-red-600 mt-1" 
          id={props.id ? `${props.id}-error` : undefined}
        >
          {displayError}
        </p>
      ) : helperText ? (
        <p className="text-sm text-text-secondary mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export default Input
