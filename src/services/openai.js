/**
 * Service for interacting with OpenAI API
 * 
 * This service provides functions to use OpenAI's capabilities for:
 * - Intelligent expense categorization
 * - Budget recommendations
 * - Travel tips
 */

// In a real application, this would be an environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY'

/**
 * Categorize an expense description using OpenAI
 * @param {string} description - The expense description to categorize
 * @param {Array} categories - Available expense categories
 * @returns {Promise<string>} - The recommended category ID
 */
export const categorizeExpense = async (description, categories) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that categorizes travel expenses. 
                     You will be given an expense description and a list of available categories. 
                     Respond with only the category ID that best matches the expense.`
          },
          {
            role: 'user',
            content: `Expense description: "${description}"
                     Available categories: ${JSON.stringify(categories.map(cat => ({
                       id: cat.categoryId,
                       name: cat.categoryName
                     })))}`
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to categorize expense')
    }
    
    // Extract the category ID from the response
    const categoryId = data.choices[0].message.content.trim()
    
    // Validate that the returned category ID exists in our categories
    if (categories.some(cat => cat.categoryId === categoryId)) {
      return categoryId
    } else {
      // Default to the first category if the API returns an invalid category
      return categories[0].categoryId
    }
  } catch (error) {
    console.error('Error categorizing expense:', error)
    // Default to the first category on error
    return categories[0].categoryId
  }
}

/**
 * Get budget recommendations based on trip details
 * @param {object} tripDetails - Details about the trip
 * @returns {Promise<object>} - Budget recommendations for each category
 */
export const getBudgetRecommendations = async (tripDetails) => {
  try {
    const { destination, duration, travelers, style } = tripDetails
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a travel budget expert. Provide budget recommendations in JSON format for each expense category.`
          },
          {
            role: 'user',
            content: `I'm planning a trip to ${destination} for ${duration} days with ${travelers} travelers. 
                     Our travel style is ${style} (budget, moderate, luxury).
                     Provide budget recommendations for these categories: Flights, Accommodation, Food & Dining, Activities, Transportation, Miscellaneous.
                     Respond with a JSON object where keys are category names and values are recommended amounts in USD.`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get budget recommendations')
    }
    
    // Parse the JSON response
    const recommendations = JSON.parse(data.choices[0].message.content)
    return recommendations
  } catch (error) {
    console.error('Error getting budget recommendations:', error)
    // Return default recommendations on error
    return {
      'Flights': 500,
      'Accommodation': 100 * tripDetails.duration,
      'Food & Dining': 50 * tripDetails.duration * tripDetails.travelers,
      'Activities': 30 * tripDetails.duration * tripDetails.travelers,
      'Transportation': 20 * tripDetails.duration,
      'Miscellaneous': 10 * tripDetails.duration * tripDetails.travelers
    }
  }
}

/**
 * Get travel tips for a destination
 * @param {string} destination - The travel destination
 * @returns {Promise<Array>} - Array of travel tips
 */
export const getTravelTips = async (destination) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a travel expert. Provide helpful budget-saving tips for travelers.`
          },
          {
            role: 'user',
            content: `I'm traveling to ${destination}. Can you give me 5 specific budget-saving tips for this destination? 
                     Focus on practical advice for saving money while still enjoying the trip.
                     Format your response as a JSON array of tip objects, each with a 'title' and 'description' field.`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get travel tips')
    }
    
    // Parse the JSON response
    const tips = JSON.parse(data.choices[0].message.content)
    return tips
  } catch (error) {
    console.error('Error getting travel tips:', error)
    // Return default tips on error
    return [
      {
        title: 'Research local transportation options',
        description: 'Public transportation is often much cheaper than taxis or rental cars.'
      },
      {
        title: 'Eat where locals eat',
        description: 'Tourist areas tend to have inflated prices. Find restaurants frequented by locals for better value.'
      },
      {
        title: 'Book accommodations in advance',
        description: 'Last-minute bookings often come with premium prices.'
      },
      {
        title: 'Look for free activities',
        description: 'Many destinations offer free walking tours, museum days, or natural attractions.'
      },
      {
        title: 'Travel during off-peak season',
        description: 'Prices for accommodations and flights are typically lower outside of peak tourist seasons.'
      }
    ]
  }
}

