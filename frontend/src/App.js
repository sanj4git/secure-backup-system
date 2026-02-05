import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Auditor from "./pages/Auditor";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OTP />} />

        {/* USER */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRole="USER">
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="ADMIN">
            <Admin />
          </ProtectedRoute>
        } />

        {/* AUDITOR */}
        <Route path="/auditor" element={
          <ProtectedRoute allowedRole="AUDITOR">
            <Auditor />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;