import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Error boundary for the entire application
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4 text-destructive">
              Application Error
            </h1>
            <p className="text-muted-foreground mb-6">
              Something went wrong. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Performance monitoring
const startTime = performance.now()

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
)

// Log performance metrics
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime
  console.log(`App loaded in ${loadTime.toFixed(2)}ms`)
  
  // Mark app as loaded (removes loading spinner)
  document.documentElement.classList.add('app-loaded')
  
  // Performance API metrics
  if (typeof performance.getEntriesByType === 'function') {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      console.log('Performance Metrics:', {
        'DNS Lookup': navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        'TCP Connection': navigationEntry.connectEnd - navigationEntry.connectStart,
        'Request Time': navigationEntry.responseStart - navigationEntry.requestStart,
        'Response Time': navigationEntry.responseEnd - navigationEntry.responseStart,
        'DOM Processing': navigationEntry.domComplete - navigationEntry.domLoading,
        'Total Load Time': navigationEntry.loadEventEnd - navigationEntry.navigationStart
      })
    }
  }
})

// Register service worker for caching (optional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered: ', registration)
    })
    .catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
}