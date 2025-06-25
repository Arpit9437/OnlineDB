import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute
