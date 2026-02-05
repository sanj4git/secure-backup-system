import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Auditor from "./pages/Auditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OTP />} />

        {/* Role Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auditor" element={<Auditor />} />

      </Routes>
    </BrowserRouter>
  );
}