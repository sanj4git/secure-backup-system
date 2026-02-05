import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function OTP() {

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  // ✅ If already logged in, skip OTP page
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {

      if (role === "ADMIN") navigate("/admin");
      else if (role === "AUDITOR") navigate("/auditor");
      else navigate("/dashboard");

    }

  }, [navigate]);

  const handleVerify = async (e) => {

    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    try {

      const userId = localStorage.getItem("userId");

      const res = await API.post("/auth/verify-otp", {
        userId,
        otp
      });

      // Save token + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // Redirect based on role
      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else if (res.data.user.role === "AUDITOR") {
        navigate("/auditor");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {

      console.log(error);

      setErrorMsg(
        error?.response?.data?.msg || "Invalid OTP. Try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container">

      <h2>OTP Verification</h2>

      <form onSubmit={handleVerify}>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {/* Error message */}
        {errorMsg && (
          <p style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </form>

    </div>
  );
}