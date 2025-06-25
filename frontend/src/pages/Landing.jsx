import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Landing = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your personal <span className="text-blue-600">PostgreSQL</span> playground
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Instantly run SQL queries, create and manage tables, and visualize your data — all from a clean, browser-based interface.
          </p>

          {user ? (
            <Link
              to="/home"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl bg-white"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">✨ Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">SQL Editor</h3>
              <p className="text-gray-600">
                Advanced editor with syntax highlighting and live results for seamless query writing
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Setup Needed</h3>
              <p className="text-gray-600">
                Start querying your own schema instantly — no installations, no configs required
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Table Management</h3>
              <p className="text-gray-600">
                View, create, and modify tables through intuitive UI or direct SQL commands
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing