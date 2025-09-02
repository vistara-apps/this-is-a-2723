import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Card from './ui/Card'

function BudgetVisualization({ trip }) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  // Prepare data for charts
  const budgetVsActual = trip.expenseCategories.map((category, index) => ({
    name: category.categoryName,
    budget: category.estimatedAmount,
    actual: category.actualAmount,
    color: colors[index % colors.length]
  }))

  const expenseDistribution = trip.expenseCategories
    .filter(category => category.actualAmount > 0)
    .map((category, index) => ({
      name: category.categoryName,
      value: category.actualAmount,
      color: colors[index % colors.length]
    }))

  const totalBudget = trip.expenseCategories.reduce((sum, cat) => sum + cat.estimatedAmount, 0)
  const totalSpent = trip.expenseCategories.reduce((sum, cat) => sum + cat.actualAmount, 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'budget' ? 'Budget' : 'Actual'}: {trip.currency} {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }}>
            {trip.currency} {data.value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">Budget Analytics</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Budget Utilization</h3>
          <p className="text-3xl font-bold text-primary">
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
          </p>
        </Card>

        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Categories Used</h3>
          <p className="text-3xl font-bold text-accent">
            {trip.expenseCategories.filter(cat => cat.actualAmount > 0).length}
          </p>
          <p className="text-sm text-text-secondary">of {trip.expenseCategories.length}</p>
        </Card>

        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Average Expense</h3>
          <p className="text-3xl font-bold text-text-primary">
            {trip.currency} {
              trip.expenses && trip.expenses.length > 0 
                ? (totalSpent / trip.expenses.length).toFixed(2)
                : '0.00'
            }
          </p>
        </Card>
      </div>

      {/* Budget vs Actual Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Budget vs Actual Spending</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVsActual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
              <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution Pie Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Expense Distribution</h3>
          {expenseDistribution.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-text-secondary">No expenses to display</p>
            </div>
          )}
        </Card>

        {/* Category Performance */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Category Performance</h3>
          <div className="space-y-4">
            {trip.expenseCategories.map((category, index) => {
              const percentage = category.estimatedAmount > 0 
                ? (category.actualAmount / category.estimatedAmount) * 100 
                : 0
              const color = colors[index % colors.length]
              
              return (
                <div key={category.categoryId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.categoryName}</span>
                    <span className={percentage > 100 ? 'text-red-600' : 'text-text-secondary'}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary w-16 text-right">
                      {trip.currency} {category.actualAmount.toFixed(0)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default BudgetVisualization