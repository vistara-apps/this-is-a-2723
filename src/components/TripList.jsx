import React from 'react'
import { Calendar, MapPin, DollarSign } from 'lucide-react'
import { useTripBudget } from '../context/TripBudgetContext'
import Card from './ui/Card'

function TripList({ onTripSelect }) {
  const { trips, setCurrentTrip } = useTripBudget()

  const handleTripClick = (trip) => {
    setCurrentTrip(trip)
    onTripSelect(trip)
  }

  const getTripProgress = (trip) => {
    const totalBudget = trip.expenseCategories.reduce((sum, cat) => sum + cat.estimatedAmount, 0)
    const totalSpent = trip.expenseCategories.reduce((sum, cat) => sum + cat.actualAmount, 0)
    return { totalBudget, totalSpent, percentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0 }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-text-primary">Your Trips</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trips.map(trip => {
          const progress = getTripProgress(trip)
          const isUpcoming = new Date(trip.startDate) > new Date()
          
          return (
            <Card
              key={trip.tripId}
              onClick={() => handleTripClick(trip)}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg text-text-primary truncate">
                    {trip.tripName}
                  </h3>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${isUpcoming 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                    }
                  `}>
                    {isUpcoming ? 'Upcoming' : 'Active'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Calendar size={16} />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <DollarSign size={16} />
                    <span>
                      ${progress.totalSpent.toFixed(2)} / ${progress.totalBudget.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>Budget Progress</span>
                      <span>{progress.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress.percentage > 100 
                            ? 'bg-red-500' 
                            : progress.percentage > 80 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default TripList