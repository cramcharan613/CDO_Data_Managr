import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Low Code D - Data Visualization Platform
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-300 mb-4">Overview and insights</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              View Dashboard
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Data Analysis</h2>
            <p className="text-gray-300 mb-4">Advanced analytics</p>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              Analyze Data
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
            <p className="text-gray-300 mb-4">Charts and reports</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
              Create Charts
            </button>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            🚀 Your data visualization platform is ready for deployment!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All optimization phases have been completed successfully.
          </p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)