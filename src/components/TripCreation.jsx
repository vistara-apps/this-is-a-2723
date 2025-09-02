import React, { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'

function TripCreation({ onComplete }) {
  const { addTrip, user } = useTripBudget()
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBudgetChange = (category, amount) => {
    setBudgetData(prev => ({ ...prev, [category]: parseFloat(amount) || 0 }))
  }

  const handleSubmit = () => {
    const trip = {
      ...formData,
      userId: user.userId,
      budgetAmount: Object.values(budgetData).reduce((sum, amount) => sum + amount, 0)
    }
    
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
    
    onComplete()
  }

  const totalBudget = Object.values(budgetData).reduce((sum, amount) => sum + amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onComplete}
          className="p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Create New Trip</h1>
          <p className="text-sm text-text-secondary">Plan your budget before you go</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          1
        </div>
        <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          2
        </div>
      </div>

      {step === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Trip Details</h2>
          <div className="space-y-4">
            <Input
              label="Trip Name"
              placeholder="e.g., Summer Vacation to Hawaii"
              value={formData.tripName}
              onChange={(e) => handleFormChange('tripName', e.target.value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleFormChange('startDate', e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleFormChange('endDate', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleFormChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                disabled={!formData.tripName || !formData.startDate || !formData.endDate}
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
              <div key={key} className="flex items-center gap-4 p-4 border rounded-lg">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-primary">
                    {label}
                  </label>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={budgetData[key] || ''}
                    onChange={(e) => handleBudgetChange(key, e.target.value)}
                    className="text-right"
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
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="flex items-center gap-2"
              disabled={totalBudget === 0}
            >
              <Save size={20} />
              Create Trip
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default TripCreation