/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {object} - Object containing validation result and error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validates trip creation form data
 * @param {object} formData - The form data to validate
 * @returns {object} - Object containing validation result and error messages
 */
export const validateTripForm = (formData) => {
  const errors = {}
  
  if (!formData.tripName) {
    errors.tripName = 'Trip name is required'
  }
  
  if (!formData.startDate) {
    errors.startDate = 'Start date is required'
  }
  
  if (!formData.endDate) {
    errors.endDate = 'End date is required'
  } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
    errors.endDate = 'End date must be after start date'
  }
  
  if (!formData.currency) {
    errors.currency = 'Currency is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates expense form data
 * @param {object} formData - The form data to validate
 * @returns {object} - Object containing validation result and error messages
 */
export const validateExpenseForm = (formData) => {
  const errors = {}
  
  if (!formData.description) {
    errors.description = 'Description is required'
  }
  
  if (!formData.amount) {
    errors.amount = 'Amount is required'
  } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
    errors.amount = 'Amount must be a positive number'
  }
  
  if (!formData.categoryId) {
    errors.categoryId = 'Category is required'
  }
  
  if (!formData.date) {
    errors.date = 'Date is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates user profile form data
 * @param {object} formData - The form data to validate
 * @returns {object} - Object containing validation result and error messages
 */
export const validateProfileForm = (formData) => {
  const errors = {}
  
  if (!formData.name) {
    errors.name = 'Name is required'
  }
  
  if (!formData.currencyPreference) {
    errors.currencyPreference = 'Currency preference is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

