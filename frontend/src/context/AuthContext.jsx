import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("user_id")

    if (token && userId) {
      setUser({ id: userId, token })
    }
    setLoading(false)
  }, [])

  const login = (token, userId) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user_id", userId)
    setUser({ id: userId, token })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
