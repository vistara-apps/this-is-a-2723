import React, { Component } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          <Card className="p-6 max-w-md w-full" variant="error">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-text-secondary mb-6">
                {this.props.fallbackMessage || "We're sorry, but there was an error loading this component."}
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                  leftIcon={<RefreshCw size={16} />}
                >
                  Try Again
                </Button>
                {this.props.onReset && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      this.handleReset()
                      this.props.onReset()
                    }}
                  >
                    Go Back
                  </Button>
                )}
              </div>
              
              {this.props.showDetails && this.state.error && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left overflow-auto max-h-[200px] text-sm">
                  <p className="font-mono text-red-600">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-text-secondary">Stack trace</summary>
                      <pre className="mt-2 text-xs overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )
    }

    // If there's no error, render children normally
    return this.props.children
  }
}

export default ErrorBoundary

