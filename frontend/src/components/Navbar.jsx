"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            OnlineDB
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
