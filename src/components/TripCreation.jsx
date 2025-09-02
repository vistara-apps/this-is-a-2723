import React, { useState, useEffect } from 'react'
import { ArrowLeft, Save, Calendar, DollarSign } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import { useToast } from '../context/ToastContext'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'

function TripCreation({ onComplete }) {
  const { addTrip, user } = useTripBudget()
  const { success, error: showError } = useToast()
  const [formData, setFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    currency: user.currencyPreference
  })
  const [budgetData, setBudgetData] = useState({
    flights: 0,
    accommodation: 0,
    food: 0,
    activities: 0,
    transportation: 0,
    miscellaneous: 0
  })
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [formTouched, setFormTouched] = useState(false)

  // Validate form data
  useEffect(() => {
    if (formTouched) {
      validateForm()
    }
  }, [formData, formTouched])

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Trip name validation
    if (!formData.tripName.trim()) {
      newErrors.tripName = 'Trip name is required'
    } else if (formData.tripName.length > 50) {
      newErrors.tripName = 'Trip name must be less than 50 characters'
    }
    
    // Date validations
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    // Validate end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      
      if (end < start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFormTouched(true)
  }

  const handleBudgetChange = (category, amount) => {
    // Ensure amount is a valid number and not negative
    const parsedAmount = parseFloat(amount) || 0
    const validAmount = parsedAmount < 0 ? 0 : parsedAmount
    
    setBudgetData(prev => ({ ...prev, [category]: validAmount }))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Final validation
      if (!validateForm()) {
        showError('Please fix the errors before submitting')
        setIsSubmitting(false)
        return
      }
      
      // Validate budget data
      if (totalBudget === 0) {
        showError('Please add at least one budget item')
        setIsSubmitting(false)
        return
      }
      
      const trip = {
        ...formData,
        userId: user.userId,
        budgetAmount: totalBudget
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTrip = addTrip(trip)
      
      // Update budget categories with estimated amounts
      const categories = [
        { categoryId: '1', categoryName: 'Flights', estimatedAmount: budgetData.flights, actualAmount: 0 },
        { categoryId: '2', categoryName: 'Accommodation', estimatedAmount: budgetData.accommodation, actualAmount: 0 },
        { categoryId: '3', categoryName: 'Food & Dining', estimatedAmount: budgetData.food, actualAmount: 0 },
        { categoryId: '4', categoryName: 'Activities', estimatedAmount: budgetData.activities, actualAmount: 0 },
        { categoryId: '5', categoryName: 'Transportation', estimatedAmount: budgetData.transportation, actualAmount: 0 },
        { categoryId: '6', categoryName: 'Miscellaneous', estimatedAmount: budgetData.miscellaneous, actualAmount: 0 }
      ]
      
      success(`Trip "${formData.tripName}" created successfully!`)
      onComplete()
    } catch (err) {
      showError('Failed to create trip. Please try again.')
      console.error('Error creating trip:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalBudget = Object.values(budgetData).reduce((sum, amount) => sum + amount, 0)

  // Validate trip name
  const validateTripName = (value) => {
    if (!value.trim()) return 'Trip name is required'
    if (value.length > 50) return 'Trip name must be less than 50 characters'
    return ''
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onComplete}
          className="p-2"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Create New Trip</h1>
          <p className="text-sm text-text-secondary">Plan your budget before you go</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4" aria-label="Form progress">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
          }`}
          aria-current={step === 1 ? 'step' : undefined}
        >
          1
        </div>
        <div 
          className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} 
          aria-hidden="true"
        />
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
          }`}
          aria-current={step === 2 ? 'step' : undefined}
        >
          2
        </div>
      </div>

      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Trip Details</h2>
          <div className="space-y-4">
            <Input
              id="tripName"
              label="Trip Name"
              placeholder="e.g., Summer Vacation to Hawaii"
              value={formData.tripName}
              onChange={(e) => handleFormChange('tripName', e.target.value)}
              error={errors.tripName}
              required
              validate={validateTripName}
              helperText="Give your trip a memorable name"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="startDate"
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleFormChange('startDate', e.target.value)}
                error={errors.startDate}
                required
                leftIcon={<Calendar size={16} />}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
              <Input
                id="endDate"
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleFormChange('endDate', e.target.value)}
                error={errors.endDate}
                required
                leftIcon={<Calendar size={16} />}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="currency"
                  className="block text-sm font-medium text-text-primary mb-2 flex items-center"
                >
                  Currency
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-gray-400" />
                  </div>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => handleFormChange('currency', e.target.value)}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CNY">CNY - Chinese Yuan</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="primary"
                onClick={() => {
                  setFormTouched(true)
                  if (validateForm()) {
                    setStep(2)
                  } else {
                    showError('Please fill in all required fields')
                  }
                }}
                rightIcon={<ArrowLeft size={16} className="rotate-180" />}
              >
                Next: Set Budget
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Budget Estimation</h2>
          <p className="text-text-secondary mb-6">
            Estimate your expected expenses for each category to create your trip budget.
          </p>

          <div className="space-y-4">
            {[
              { key: 'flights', label: 'Flights', icon: '✈️' },
              { key: 'accommodation', label: 'Accommodation', icon: '🏨' },
              { key: 'food', label: 'Food & Dining', icon: '🍽️' },
              { key: 'activities', label: 'Activities & Tours', icon: '🎯' },
              { key: 'transportation', label: 'Local Transportation', icon: '🚗' },
              { key: 'miscellaneous', label: 'Miscellaneous', icon: '💼' }
            ].map(({ key, label, icon }) => (
              <div key={key} className="flex items-center gap-4 p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all">
                <span className="text-2xl" aria-hidden="true">{icon}</span>
                <div className="flex-1">
                  <label 
                    htmlFor={`budget-${key}`}
                    className="block text-sm font-medium text-text-primary"
                  >
                    {label}
                  </label>
                </div>
                <div className="w-32">
                  <Input
                    id={`budget-${key}`}
                    type="number"
                    placeholder="0.00"
                    value={budgetData[key] || ''}
                    onChange={(e) => handleBudgetChange(key, e.target.value)}
                    className="text-right"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-card rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-text-primary">Total Budget</span>
              <span className="text-2xl font-bold text-primary">
                {formData.currency} {totalBudget.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="secondary"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Creating Trip..."
              disabled={totalBudget === 0 || isSubmitting}
              leftIcon={<Save size={16} />}
            >
              Create Trip
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default TripCreation
