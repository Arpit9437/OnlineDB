import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserHome from "./pages/UserHome"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
