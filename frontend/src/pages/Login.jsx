import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {

      if (role === "ADMIN") navigate("/admin");
      else if (role === "AUDITOR") navigate("/auditor");
      else navigate("/dashboard");

    }

  }, [navigate]);

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      // Save userId for OTP step
      localStorage.setItem("userId", res.data.user.id);

      // Navigate to OTP page
      navigate("/otp");

    } catch (error) {

      console.log(error);

      setErrorMsg(
        error?.response?.data?.msg || "Login failed. Try again."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container">

      <h2>Secure Backup Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Error Message */}
        {errorMsg && (
          <p style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Login"}
        </button>

      </form>

    </div>

  );
}